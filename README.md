# Web Interface for Analyzing Microbiome Datasets
###### Brian Edwards
###### SULI Internship at Pacific Northwest Laboratory 2020

---
## What is the Problem?
Located in the Earth and Biological Sciences directorate at PNNL, the National Data Collaborative project was created to provide users in the environmental microbiology community access to microbiome data collected at national laboratories. For the first time, these researchers now had an organized database for examining protein and peptide data and their analyzed results. In order to analyze the data, the researchers had to learn how to use software tools and to run those tools separately on the command line. Needing to grasp knowledge about the command line tools proved to be an obstacle to focus on the results and moving on. This process has been slow and inefficient, which in turn, lowered productivity. The specific issue is that there is no intuitive user-interface that provides step-by-step guidance for researchers.
My mentor, [Anubhav](https://github.com/anubhav0fnu) has developed a solution, by creating a metaproteomic workflow that can perform protein/peptide identification and characterization. However, even though this pipeline solves the problem, it creates a new one with that: everytime the user will require the pipeline, it will have to be manually instantiated every time, and valuable time will be used trying to learn how to run the pipeline.

---
## What Am I Offering?
This project solves the above problem as I created an interface to the pipeline that researchers can use to analyze their protein and peptide data. This web application is functional, user-friendly, and easy-to-use with a simple step-by-stop process. This is supposed to wrap around a workflow so it can have the ability to fetch its results.

---

## Before Running
##### Scenario 1
- If you plan on using the default `target` path values, before running the app, on the command line, run

    * `sudo mount -t drvfs '//pnl/Projects/MSSHARE' /mnt/d`
##### Scenario 2
- If you like to utilize your own unique path, ensure that the variable `target` is facing the right directory for each function by going into the back-ends's [App.py](https://github.com/brianedwards00/FlaskAndReact/blob/master/FlaskAndReact/react-flask-app/flask-backend/app.py), and changing lines (only edit where it says `*here*`):

    * 68 `target = os.path.join('*here*/Anubhav/storage/data/dpkgs', data_dpkgs)`
    * 80, `target = os.path.join('*here*/Anubhav/storage/results/dpkgs', results_dpkgs)`
    * 95, `target = os.path.join('*here*/Anubhav/storage/data/set_of_Dataset_IDs', data_dataset_id[0], data_dataset_id[1])`
    * 112, `target = os.path.join('*here*/Anubhav/storage/results/set_of_Dataset_IDs', results_dataset_id[0], results_dataset_id[1])`
    * 128, `target = os.path.join('*here*/Anubhav/storage/data/set_of_Jobs', data_job_id[1])`
    * 144, `target = os.path.join('*here*/Anubhav/storage/results/set_of_Jobs', results_job_id[1])`
- Then after, supposedly you will have to mount to the network share drive, so on the command line, run:

    * `sudo mount -t drvfs '//pnl/Projects/MSSHARE' *here*`
---
## How to Run
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
#### Available Scripts
In the project directory on the command line, you can run:
###### `yarn start`
- Runs the front-end (what the users see)
- Opens [http://localhost:3000](http://localhost:3000) to view it in the browser.

###### `yarn start-api`
- Runs the back-end (the processor and retriever)

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
