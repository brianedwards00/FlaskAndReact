from flask import Flask, request, send_file
import json
import zipfile
from json.decoder import JSONDecodeError
from flask_cors import CORS
import time
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)
counter = 1
target = ""


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
            kw['log_time'][name] = int((te - ts) * 1000)
        else:
            print('%r  %2.2f ms' % \
                  (method.__name__, (te - ts) * 1000))
        return result

    return timed


@app.route('/data', methods=['GET', 'POST'])
def data():
    """
    Collects dataset name and id and records it onto a json file stored locally
    :return: the json object that will be inserted into the file
    """
    global counter
    # Receives the json data from front end
    input_data = request.get_data()
    # Since it came in bytes, let's decode it to normal letters
    input_dict = input_data.decode("utf8").replace("'", '"')
    # Create a json variable with the decoded string
    input_json = json.loads(input_dict)
    # Open the file that keeps track of submissions
    with open("results.json", "r+") as file_json:
        # This try sees if there is anything already in this file, if there isn't, it will bring up an error.
        # In my case, it will skip down to except
        try:
            # Scenario 1: There is already content
            # Create a variable holding all the file's contents
            json_data = json.load(file_json)
            # Create a new Run # key value pair to add
            json_data_to_add = {"Run #" + str(counter): input_json}
            # Writes it to the variable that contains the file contents
            json_data.update(json_data_to_add)
            # Goes to beginning of the file
            file_json.seek(0)
            # Overwrites the new contents into the file
            json.dump(json_data, file_json, indent=4)
            # Scenario 2: The file is just empty because of deletion of it's a new one
        except JSONDecodeError:
            # Tells the file the we will add json data by adding a list
            json.dump([], file_json)
            # Creates json data that will go into the file
            json_data = {"Run #" + str(counter): input_json}
            # Goes to beginning of the file
            file_json.seek(0)
            # Writes the data into the file
            json.dump(json_data, file_json, indent=4)
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
    target = os.path.join('/mnt/d/Anubhav/Brian', 'test_docs')
    if not os.path.isdir(target):
        os.makedirs(target)
    # Loops the files in the FileStorage sent from front-end
    for i in request.files:
        file = request.files[i]
        # Collects filename variable from front-end
        filename = secure_filename(file.filename)
        # Creates a destination folder from these two variables
        destination = "/".join([target, filename])
        # Saves/Writes to destination
        file.save(destination)
        # After saving, it will open up the results.json folder to take notes of what got sent
        with open("results.json", "r+") as file_json:
            # Loads ALL current data into json_data
            json_data = json.load(file_json)
            # Retrieves the specific Run # value json object
            data_1 = json_data["Run #" + str(counter)]
            # These lines are to create a key that matches the type of file that has uploaded (txt, raw, etc)
            name, extension = os.path.splitext(destination)
            extension = extension.replace('.', '')
            # Creates a variable that will soon be added to the specific Run # json object
            data_2 = {extension + '_path' + str(filecounter): destination}
            # Combines the specific Run # value from before and adds a new key:value to it
            # (eg txt_path1: *path to where it will go to*)
            data_1.update(data_2)
            # Adds the key in front of the value created above
            json_data_to_add = {"Run #" + str(counter): data_1}
            # Overwrite all the data to include the new Run # with added values
            json_data.update(json_data_to_add)
            # Goes to beginning of the file
            file_json.seek(0)
            # Writes the completed json_data into the file
            json.dump(json_data, file_json, indent=4)
            # Increment counter to ensure there are no key duplicates
            filecounter += 1
    counter += 1
    response = "FINISHED with data"
    return response


@app.route('/dropdown', methods=['GET', 'POST'])
def dropdown():
    """
    Creates the dropdown choices from a specific network file location
    :return: All the file names including in 'target'
    """
    global target
    string1 = ""
    string2 = ""
    string3 = ""
    target = os.path.join('/mnt/d/Anubhav/storage/results/dpkgs', '3458', 'analysis_result')
    entries = os.listdir(target)
    for e in entries:
        if e != "data" and e != "plots":
            string1 = string1 + e + "! "
        else:
            continue
    target1 = os.path.join(target,'data')
    entries = os.listdir(target1)
    for e in entries:
        string2 = string2 + e + "? "
    target2 = os.path.join(target,'plots')
    entries = os.listdir(target2)
    for e in entries:
        string3 = string3 + e + "$ "

    return '{} {} {}'.format(string1, string2, string3)


@app.route('/dropdown_submit', methods=['GET', 'POST'])
def dropdown_submit():
    """
    Collects the file names from front end, finds the files on the network, packs them into a zip, and sends it to
    front end
    :return:
    """
    global target
    input_raw = request.get_data()
    input_decoded = input_raw.decode("utf8").replace("'", '"')
    input_json = json.loads(input_decoded)
    entries = os.listdir(target)
    # Searching in an array of dictionaries
    for inner_obj in input_json:
        my_val = inner_obj['value']
        if inner_obj.get('options') is not None:
            option_list = inner_obj['options']
            option_obj = option_list[0]
            my_val = option_obj['value']
        print('The real file name is:', my_val)
        '''
        if input_json[i]['options'] is None:
            file_name = i['value']
            find_file = os.path.join(target, file_name)
            print(find_file)
            '''

    # zipf = zipfile.ZipFile('DD.zip','w', zipfile.ZIP_DEFLATED)

    return 'hi'
