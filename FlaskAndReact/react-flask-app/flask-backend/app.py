from flask import Flask, request, send_file
import json
import zipfile
from json.decoder import JSONDecodeError
from flask_cors import CORS
import time
import subprocess
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)
counter = 1
target = ""
dpkg = "3458"


# def sum_of_n():
# fun def

# return sum_n


def timeit(method):
    """
    decorator to time my function.
    :param method: any function
    :return: time in
    """

    def timed(*args, **kw):
        ts = time.time()
        result = method(*args, **kw)
        te = time.time()
        if 'log_time' in kw:
            name = kw.get('log_name', method.__name__.upper())
            kw['log_time'][name] = time.strftime("%H:%M:%S", time.gmtime((te - ts)))
        else:
            # print('%r took  %2.2f ms' % \
            #       (method.__name__, (te - ts) * 1000))
            print("{} took {}.".format(method.__name__, time.strftime("%H:%M:%S", time.gmtime((te - ts)))))
        return result

    return timed


def calculate_tree(path):
    d = {'value': os.path.basename(path), 'label': os.path.basename(path)}
    if os.path.isdir(path):
        print(path)
        d['options'] = [calculate_tree(os.path.join(path, x)) for x in os.listdir(path)]
    return d


def pipeline(path):
    sum = 0
    for i in range(1, 999):
        sum += i
    f = open(os.path.join(path, str(sum)) + '.txt', 'w+')
    f.close()
    return f


@app.route('/datadpkgs', methods=['GET', 'POST'])
def datadpkgs():
    global target
    data_dpkgs = request.get_data().decode('utf8')
    target = os.path.join('/mnt/d/Anubhav/storage/data/dpkgs', data_dpkgs)
    try:
        e = os.listdir(target)
    except FileNotFoundError:
        return 'Error'
    return json.dumps(calculate_tree(target))


@app.route('/resultsdpkgs', methods=['GET', 'POST'])
def resultsdpkgs():
    global target
    results_dpkgs = request.get_data().decode('utf8')
    target = os.path.join('/mnt/d/Anubhav/storage/results/dpkgs', results_dpkgs,'430135')
    try:
        e = os.listdir(target)
    except FileNotFoundError:
        return 'Error'
    pipeline(target)
    return json.dumps(calculate_tree(target))


@app.route('/datadataset_id', methods=['GET', 'POST'])
def datadataset_id():
    global target
    data_dataset_id = request.get_data().decode('utf8').split(',')
    for i in range(len(data_dataset_id)):
        data_dataset_id[i] = data_dataset_id[i].lower()
    target = os.path.join('/mnt/d/Anubhav/storage/data/set_of_Dataset_IDs'
                          , data_dataset_id[0], data_dataset_id[1])
    try:
        e = os.listdir(target)
    except FileNotFoundError:
        return 'Error'
    return json.dumps(calculate_tree(target))


@app.route('/resultsdataset_id', methods=['GET', 'POST'])
def resultsdataset_id():
    global target
    results_dataset_id = request.get_data().decode('utf8').split(',')
    for i in range(len(results_dataset_id)):
        results_dataset_id[i] = results_dataset_id[i].lower()
    target = os.path.join('/mnt/d/Anubhav/storage/results/set_of_Dataset_IDs'
                          , results_dataset_id[0], results_dataset_id[1])
    try:
        e = os.listdir(target)
    except FileNotFoundError:
        return 'Error'
    pipeline(target)
    return json.dumps(calculate_tree(target))


@app.route('/datajob_id', methods=['GET', 'POST'])
def datajob_id():
    global target
    data_job_id = request.get_data().decode('utf8').split(',')
    for i in range(len(data_job_id)):
        data_job_id[i] = data_job_id[i].lower()
    target = os.path.join('/mnt/d/Anubhav/storage/data/set_of_Jobs',
                          data_job_id[1])
    print(target)
    try:
        e = os.listdir(target)
    except FileNotFoundError:
        return 'Error'
    return json.dumps(calculate_tree(target))


@app.route('/resultsjob_id', methods=['GET', 'POST'])
def resultsjob_id():
    global target
    results_job_id = request.get_data().decode('utf8').split(',')
    for i in range(len(results_job_id)):
        results_job_id[i] = results_job_id[i].lower()
    target = os.path.join('/mnt/d/Anubhav/storage/results/set_of_Jobs'
                          , results_job_id[1])
    try:
        e = os.listdir(target)
    except FileNotFoundError:
        return 'Error'
    pipeline(target)
    return json.dumps(calculate_tree(target))


@app.route('/data', methods=['GET', 'POST'])
def data():
    """
    Collects dataset name and id and records it onto a json file stored locally
    :return: the json object that will be inserted into the file
    """
    global counter
    input_data = request.get_data()
    input_dict = input_data.decode("utf8").replace("'", '"')
    input_json = json.loads(input_dict)
    with open("results.json", "r+") as file_json:
        # This try sees if there is anything already in this file, if there isn't, it will bring up an error.
        # In my case, it will skip down to except
        try:
            # Scenario 1: There is already content
            # Create a variable holding all the file's contents
            json_data = json.load(file_json)
            json_data_to_add = {"Run #" + str(counter): input_json}
            json_data.update(json_data_to_add)
            file_json.seek(0)
            json.dump(json_data, file_json, indent=4)
            print(json_data, file_json)
            # Scenario 2: The file is just empty because of deletion of it's a new one
        except JSONDecodeError:
            json.dump([], file_json)
            json_data = {"Run #" + str(counter): input_json}
            file_json.seek(0)
            json.dump(json_data, file_json, indent=4)
    counter += 1
    return input_json


@app.route('/files', methods=['GET', 'POST'])
@timeit
def files():
    """
    Receives files and uploads them to 'target'
    :return: Finished as a <string>
    """
    global counter, target
    filecounter = 1
    # Mount D is mounted to a network share
    # sudo mount -t drvfs '//pnl/Projects/MSSHARE' /mnt/d
    record_target = os.path.join('/mnt/d/Anubhav/storage/data/external')
    if not os.path.isdir(record_target):
        os.makedirs(record_target)
    for i in request.files:
        file = request.files[i]
        filename = secure_filename(file.filename)
        destination = "/".join([record_target, filename])
        file.save(destination)
        name, extension = os.path.splitext(destination)
        with open("results.json", "r+") as file_json:
            try:
                json_data = json.load(file_json)
                if "Run #" + str(counter) in json_data:
                    data_1 = json_data["Run #" + str(counter)]
                    extension = extension.replace('.', '')
                    data_2 = {extension + '_path' + str(filecounter): destination}
                    data_1.update(data_2)
                    json_data_to_add = {"Run #" + str(counter): data_1}
                    json_data.update(json_data_to_add)

                else:
                    extension = extension.replace('.', '')
                    data_1 = {extension + '_path' + str(filecounter): destination}
                    data_2 = {"Run #" + str(counter): data_1}
                    json_data.update(data_2)
                file_json.seek(0)
                json.dump(json_data, file_json, indent=4)
                filecounter += 1
            except JSONDecodeError:
                json.dump([], file_json)
                extension = extension.replace('.', '')
                data_ = {extension + '_path' + str(filecounter): destination}
                json_data = {"Run #" + str(counter): data_}
                file_json.seek(0)
                json.dump(json_data, file_json, indent=4)
                filecounter += 1
    counter += 1
    print("Finished writing data")
    print('Running pipeline now...')
    target = record_target.replace('data', 'results')
    print('Finished pipeline...saving results')
    return json.dumps(calculate_tree(target))


@app.route('/dropdown_submit', methods=['GET', 'POST'])
def dropdown_submit():
    """
    Collects the file names from front end, finds the files on the network, packs them into a zip, and sends it to
    front end
    :return:
    """
    global target, dpkg
    zipf = zipfile.ZipFile('data.zip', 'w', zipfile.ZIP_DEFLATED)
    input_raw = request.get_data()
    input_decoded = input_raw.decode("utf8").replace("'", '"')
    input_json = json.loads(input_decoded)
    file_names = []
    for inner1 in input_json:
        if inner1.get('options') is not None:
            for inner2 in inner1['options']:
                if inner2.get('options') is not None:
                    for inner3 in inner2['options']:
                        if inner3.get('options') is not None:
                            for inner4 in inner3['options']:
                                if inner4.get('options') is not None:
                                    for inner5 in inner4['options']:
                                        file_names.append(inner5['value'])
                                else:
                                    file_names.append(inner4['value'])
                        else:
                            file_names.append(inner3['value'])
                else:
                    file_names.append(inner2['value'])
        else:
            file_names.append(inner1['value'])
    print('The real file name is:', file_names)
    if '/data' in target and (len(file_names) > 1 or not any('.txt' in s for s in file_names)):
        print('Writing file type error...')
        f = open("error.txt", 'w+')
        f.close()
        zipf.write('error.txt')
        zipf.close()
        return send_file('data.zip', as_attachment=True)
    if '/results' in target:
        for f in file_names:
            if ('.csv' not in f and '.jpg' not in f and '.png' not in f) \
                    or len(file_names) > 3:
                print('Writing file type error...')
                f = open("error.txt", 'w+')
                f.close()
                zipf.write('error.txt')
                zipf.close()
                return send_file('data.zip', as_attachment=True)
    loop = 0
    for files in file_names:
        for (roots, directories, file_array) in os.walk(target, topdown=True):
            if files in file_array:
                print('Writing', files, 'to zipfile...')
                loop += 1
                zipf.write(os.path.join(roots, files))
                if '/data' in target:
                    zipf.close()
                    print('Sending back...')
                    return send_file('data.zip', as_attachment=True)
            print('A', roots)
            print('B', directories)
            print('C', file_array)
    if '/results' in target and loop != len(file_names):
        print('Writing not found error...')
        f = open("error.txt", 'w+')
        f.close()
        zipf.write('error.txt')
    zipf.close()
    print('Sending back...')
    return send_file('data.zip', as_attachment=True)
