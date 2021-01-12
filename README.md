# Web Interface for Analyzing Microbiome Datasets
###### Brian Edwards
###### SULI Internship at Pacific Northwest Laboratory 2020

---
## What is the Problem?
Located in the Earth and Biological Sciences directorate at PNNL, the National Data Collaborative project was created to provide users in the environmental microbiology community access to microbiome data collected at national laboratories. In order to analyze the data, the researchers had to learn how to use software tools and to run those tools separately on the command line. Needing to grasp knowledge about the command line tools are sometimes impediments for faster analysis that invloves invoking multiple tools. This process has been slow and inefficient, which in turn, lowered productivity. The specific issue is that there is no intuitive user-interface that provides step-by-step guidance for researchers for running the Meta-proteomics workflow.
A group has developed a solution [here](https://github.com/PNNL-Comp-Mass-Spec/NMDC-Proteomics-Workflow), by creating a metaproteomic workflow that can perform protein/peptide identification and characterization. However, even though this pipeline solves the problem, it creates a new one with that: everytime the user will require the pipeline, it will have to be manually instantiated every time, and valuable time will be used trying to learn how to run the pipeline.

---
## What Am I Offering?
This project solves the above problem as I created a Web Application to the pipeline that researchers can use to analyze their protein and peptide data. This web application is functional, user-friendly, and easy-to-use with a simple step-by-stop process. This is supposed to wrap around a workflow so it can have the ability to fetch its results.

---
## How To Install Project on Your Computer
#### Prerequisites 
First things first, I am assuming that you are using a Ubuntu command line, or a familiar Linux one at the least <br/>
On the command line, run the following to install the necessary coding language and package manager:
- `sudo apt install python3.8`
- `sudo apt-get install yarn`
- `sudo apt-get update`
- `yarn install`

#### Install Project
On the command line, find a path to put the project in, then run the following in order:
- `git clone https://github.com/brianedwards00/FlaskAndReact.git`

#### Install back-end and its virtual environment
After, we will need to install the back-end and the virtual environment it will run in, so as a continuation of the last section, run the following in order:
- `cd FlaskAndReact`
- `cd FlaskAndReact`
- `cd react-flask-app`
- `cd flask-backend`
- `sudo apt-get install python3-venv`
- `python3 -m venv venv`
- `source venv/bin/activate`
- `pip install flask python-dotenv`
(If nothing happens, Enter once)
- `pip install flask-cors`
(If nothing happens, Enter once)
- `deactivate`
- `cd ..`

---

## Before Running
##### Scenario 1
- If you plan on using the default variable `target` mount path value in the back-end's [App.py](https://github.com/brianedwards00/FlaskAndReact/blob/master/FlaskAndReact/react-flask-app/flask-backend/app.py), before running the app, on the command line, run:

    * `sudo mount -t drvfs '//pnl/Projects/MSSHARE' /mnt/d` <br/>
(This will point your D partition to the network share drive)
##### Scenario 2
- If you like to utilize your own unique mount path, ensure that the variable `target` is facing the right directory for each function by going into the back-ends's [App.py](https://github.com/brianedwards00/FlaskAndReact/blob/master/FlaskAndReact/react-flask-app/flask-backend/app.py), and changing lines (only edit where it says `*here*`):

    * 68 `target = os.path.join('*here*/Anubhav/storage/data/dpkgs', data_dpkgs)`
    * 80, `target = os.path.join('*here*/Anubhav/storage/results/dpkgs', results_dpkgs)`
    * 95, `target = os.path.join('*here*/Anubhav/storage/data/set_of_Dataset_IDs', data_dataset_id[0], data_dataset_id[1])`
    * 112, `target = os.path.join('*here*/Anubhav/storage/results/set_of_Dataset_IDs', results_dataset_id[0], results_dataset_id[1])`
    * 128, `target = os.path.join('*here*/Anubhav/storage/data/set_of_Jobs', data_job_id[1])`
    * 144, `target = os.path.join('*here*/Anubhav/storage/results/set_of_Jobs', results_job_id[1])`
- Then after, you will have to mount to the network share drive, so on the command line, run:

    * `sudo mount -t drvfs '//pnl/Projects/MSSHARE' *here*`
---
## How to Run
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
#### Available Scripts
You know you are in the project directory on the command line when you run `ls` and you receive <br/>
`flask-backend  node_modules  package.json  public  src  yarn.lock` <br/> <br/>
Here, you can start the front-end and the back-end by running:
###### `yarn start`
- Runs the front-end (what the users see)
- Opens [http://localhost:3000](http://localhost:3000) to view it in the browser.

###### `yarn start-api`
- Runs the back-end (processor and retriever)
- You as a user do not need to access this directly

**Note: You need to run both to successfully run the web-application!**

---
## Extras
- Everytime the pipeline runs, `results.json` gets updated of which files got processed and if the user ran externally, where did the data files go on the network share drive. This JSON file is currently stored on the user's system, in the back-end [folder](https://github.com/brianedwards00/FlaskAndReact/blob/master/FlaskAndReact/react-flask-app/flask-backend/results.json) for now.
---
## Future Work
- Instead of uploading files to the network shared drive one at a time, I would implement a way where they would be compressed into a zip file to reduce its size. If that proves to still be slow, I will find other implementations to increase file writing speeds.
- An integration of my pipeline to Anubhav’s pipeline will be necessary. 
- Even though the pipeline can handle uploaded data, we still want to store the data properly in a hierarchy in the shared network drive. I would look to create that hierarchy in order to keep the drive organized for the administrators and website users to easily access.
- The ability for users to download a filtered ReactTable
- Adding functionality to view cross-tabs
- Making plots more interactive, instead of the current png/jpg
- To successfully implement the Redux library into the app
---
## Dependencies
- @testing-library/jest-dom: Custom jest matchers to test the state of the DOM  <br/>
- @testing-library/react: Simple and complete React DOM testing utilities that encourage good testing practices. <br/>
- @testing-library/user-event: Simulate user events for react-testing-library <br/>
- blueimp-canvas-to-blob: Canvas to Blob is a polyfill for the standard JavaScript canvas.toBlob method. It can be used to create Blob objects from an HTML canvas element. <br/>
- file-saver: An HTML5 saveAs() FileSaver implementation <br/>
- jquery: JavaScript library for DOM operations <br/>
- jszip: Create, read and edit .zip files with JavaScript http://stuartk.com/jszip <br/>
- package-json-to-readme: Generate a README.md from package.json contents <br/>
- react: React is a JavaScript library for building user interfaces. <br/>
- react-csv-to-table: React library to show a simple table <br/>
- react-dom: React package for working with the DOM. <br/>
- react-multi-level-selector: Multi level dropdown options selector for application <br/>
- react-redux: Official React bindings for Redux <br/>
- react-scripts: Configuration and scripts for Create React App. <br/>
- react-select: A Select control built with and for ReactJS <br/>
- react-table: Hooks for building lightweight, fast and extendable datagrids for React <br/>
- react-table-v6: A fast, lightweight, opinionated table and datagrid built on React <br/>
- react-tabulator: React Tabulator is based on tabulator - a JS table library with many advanced features. <br/>
- redux: Predictable state container for JavaScript apps <br/>
- redux-logger: Logger for Redux <br/>
- tabulator: Put data into tables <br/>
- tabulator-tables: Interactive table generation JavaScript library <br/>
- txt-file-to-json: Reads a txt file having a table and returns an array of obects. In which each object consists of all headers as keys and there data as values. <br/>
---
## Python Virtual Environment Pip Requirements and Versions
- click==7.1.2 </br>
- Flask==1.1.2 <br/>
- Flask-Cors==3.0.8 <br/>
- itsdangerous==1.1.0 <br/>
- Jinja2==2.11.2 <br/>
- MarkupSafe==1.1.1 <br/>
- python-dotenv==0.14.0 <br/>
- six==1.15.0 <br/>
- Werkzeug==1.0.1 <br/>
---
## Visual Examples
### Pre-Pipeline Display for Internal Processing
![Example1](https://github.com/brianedwards00/FlaskAndReact/blob/master/README%20Images/Internal%201.png)
### Output After Clicking "Display" (Internal)
![Example2](https://github.com/brianedwards00/FlaskAndReact/blob/master/README%20Images/Internal%202.png)
### Output After Clicking "Run Pipeline" (Internal)
![Example3](https://github.com/brianedwards00/FlaskAndReact/blob/master/README%20Images/Internal%203.png)
### Pre-Pipeline Display for External Processing
![Example4](https://github.com/brianedwards00/FlaskAndReact/blob/master/README%20Images/External%201.png)
### Output After Clicking "Run Pipeline" (External)
![Example5](https://github.com/brianedwards00/FlaskAndReact/blob/master/README%20Images/External%202.png)
### Table Output
![Example6](https://github.com/brianedwards00/FlaskAndReact/blob/master/README%20Images/Output%201.png)
### Graph Output
![Example7](https://github.com/brianedwards00/FlaskAndReact/blob/master/README%20Images/Output%202.png)

