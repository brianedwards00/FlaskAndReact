import React from 'react';
import MultiLevelSelect from 'react-multi-level-selector'
import './App.css';
import JSZip from 'jszip';
//FIXME: v7 doesn't work, but v6 does
// yarn v1.22.4
import ReactTable from "react-table-v6";
import "react-table-v6/react-table.css"
import {saveAs} from "file-saver"
import {connect} from "react-redux";

let checker1 = 0, checker2 = 1


// Maybe add a Start Over button that refreshes page
class App extends React.Component {

    constructor(props) {
        super(props)
        // Sets the variables that each front-end instance will have
        this.state = {
            datapackage_id: '',
            dataset_id: '',
            job_number: '',
            study_name1:'',
            study_name2:'',
            selectedFiles: null,
            options: [],
            optionsChosen: [],
            file_rows: [],
            file_columns: [],
            file_data: [],
            pic1: new Image(),
            pic2: new Image()
        }


        this.handleInputButton = this.handleInputButton.bind(this)
        this.handleOutputButton = this.handleOutputButton.bind(this)
        this.handlePNNLButton = this.handlePNNLButton.bind(this)
        this.handleNMDCButton = this.handleNMDCButton.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleDisplay = this.handleDisplay.bind(this)
        this.handleInternalPipe = this.handleInternalPipe.bind(this)
        this.handleFileSubmit = this.handleFileSubmit.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this)
        this.handleDropDownChange = this.handleDropDownChange.bind(this)
        this.handleMultiSubmit = this.handleMultiSubmit.bind(this)
        this.handleFileDownload = this.handleFileDownload.bind(this)
    }

    handleInputButton = event => {
        event.preventDefault()
        if (checker1 === 1) {
            window.alert('Please finish the task at hand first.')
            return
        }
        document.getElementById('input_button').style.textDecoration = 'underline'
        document.getElementById('output_button').style.textDecoration = 'none'
        document.getElementById('area1').style.visibility = 'hidden'
        document.getElementById('area2').style.visibility = 'hidden'
        document.getElementById('area3').style.visibility = 'hidden'
        document.getElementById('table').style.visibility = 'hidden'
        document.getElementById('tsv').style.visibility = 'hidden'
        document.getElementById('success').style.visibility = 'hidden'
        document.getElementById('loading1.2').style.visibility = 'hidden'
        document.getElementById('success2').style.visibility = 'hidden'
        document.getElementById('area4').style.visibility = 'hidden'
        document.getElementById('data_success').style.visibility = 'hidden'
        document.getElementById('pic_div1').style.visibility = 'hidden'
        document.getElementById('pic_div2').style.visibility = 'hidden'
        document.getElementById('submit_button4').style.visibility = 'hidden'
        document.getElementById('p_table').style.visibility = 'hidden'
    }

    handleOutputButton = (event) => {
        event.preventDefault()
        if(checker2 === 1) {
            window.alert('Please view pipeline results first.')
            return
        }
        for (let i = 0;i<this.state.file_data.length;i++){
            if(this.state.file_data[i]['file_name'].includes('tsv')) {
                document.getElementById('tsv').style.visibility = 'visible'
            }
            if(this.state.file_data[i]['file_name'].includes('png') ||
            this.state.file_data[i]['file_name'].includes('jpg')) {
                document.getElementById('pic_div1').style.visibility = 'visible'
                document.getElementById('pic_div2').style.visibility = 'visible'
            }
            document.getElementById('success2').style.visibility = 'visible'
            document.getElementById('p_table').style.visibility = 'visible'
        }
        document.getElementById('area1').style.visibility = 'hidden'
        document.getElementById('area2').style.visibility = 'hidden'
        document.getElementById('area3').style.visibility = 'visible'
        document.getElementById('input_button').style.textDecoration = 'none'
        document.getElementById('output_button').style.textDecoration = 'underline'

    }

    handlePNNLButton = (event) => {
        event.preventDefault()
        if (checker1 === 1 && event.target.id !=='back_button') {
            window.alert('Please use the program all the way first.')
            return
        }
        if (event.target.id ==='back_button') {
            this.setState({
                file_rows: [],
                file_columns: []
            })
            checker1=0
        }
        document.getElementById('area1').style.visibility = 'visible'
        document.getElementById('area2').style.visibility = 'hidden'
        document.getElementById('area3').style.visibility = 'hidden'
        document.getElementById('table').style.visibility = 'hidden'
        document.getElementById('tsv').style.visibility = 'hidden'
        document.getElementById('success').style.visibility = 'hidden'
        document.getElementById('loading1.2').style.visibility = 'hidden'
        document.getElementById('success2').style.visibility = 'hidden'
        document.getElementById('area4').style.visibility = 'hidden'
        document.getElementById('pipeline1.0').disabled = false
        document.getElementById('submit_button1.1').disabled = false
        document.getElementById('submit_button1.2').disabled = false
        document.getElementById('submit_button1.3').disabled = false
        document.getElementById('inputDatapackageId').disabled = false
        document.getElementById('jobNum').disabled = false
        document.getElementById('inputId').disabled = false
        document.getElementById('study_name1').disabled = false
        document.getElementById('study_name2').disabled = false
        document.getElementById('data_success').style.visibility = 'hidden'
        document.getElementById('pic_div1').style.visibility = 'hidden'
        document.getElementById('pic_div2').style.visibility = 'hidden'
        document.getElementById('submit_button4').style.visibility = 'hidden'
        document.getElementById('p_table').style.visibility = 'hidden'

    }

    handleNMDCButton = (event) => {
        event.preventDefault()
        if(checker1 === 1 && event.target.id !=='back_button') {
            window.alert('Please use the program all the way first.')
            return
        }
        document.getElementById('data_success').style.visibility = 'hidden'
        document.getElementById('pic_div1').style.visibility = 'hidden'
        document.getElementById('pic_div2').style.visibility = 'hidden'
        document.getElementById('area1').style.visibility = 'hidden'
        document.getElementById('area2').style.visibility = 'visible'
        document.getElementById('area3').style.visibility = 'hidden'
        document.getElementById('table').style.visibility = 'hidden'
        document.getElementById('tsv').style.visibility = 'hidden'
        document.getElementById('success').style.visibility = 'hidden'
        document.getElementById('loading1.2').style.visibility = 'hidden'
        document.getElementById('success2').style.visibility = 'hidden'
        document.getElementById('area4').style.visibility = 'hidden'
        document.getElementById('submit_button4').style.visibility = 'hidden'
        document.getElementById('p_table').style.visibility = 'hidden'
    }

    // Will update the "name" value with whatever value has been inserted in "name" box
    handleChange = ({target}) => {
        this.setState({[target.name]: target.value})
    }


    handleInternalPipe = event => {
        event.preventDefault()
        if(this.state.datapackage_id ==='' && this.state.dataset_id ==='' && this.state.job_number ===''
        && this.state.study_name1 ==='' && this.state.study_name2 ==='')
        {
            window.alert('Please fill in something.')
            return
        }
        if(!((this.state.datapackage_id !== '' && this.state.dataset_id ==='' && this.state.job_number ===''
                && this.state.study_name1 ==='' && this.state.study_name2 ==='') ||
            (this.state.datapackage_id === '' && this.state.dataset_id !=='' && this.state.job_number ===''
                && this.state.study_name1 !=='' && this.state.study_name2 ==='') ||
            (this.state.datapackage_id === '' && this.state.dataset_id ==='' && this.state.job_number !==''
                && this.state.study_name1 ==='' && this.state.study_name2 !==''))) {
            window.alert('Please only have one section completed to run the pipeline.')
            return
        }
        this.setState({options:[]})
        let obj = {}

        if(this.state.datapackage_id !== '' && /^\d+$/.test(this.state.datapackage_id)) {
            obj.datapackage_id = this.state.datapackage_id
            document.getElementById('loading1.0').innerHTML = 'Loading...'
            document.getElementById('loading1.0').style.visibility = 'visible'
            fetch("http://localhost:5000/resultsdpkgs", {
                method: 'POST',
                body: this.state.datapackage_id
            })
                .then(response => response.text())
                .then(response => {
                    if(response === 'Error') {
                        document.getElementById('loading1.0').innerHTML = 'File not found. Try again.'
                        document.getElementById('pipeline1.0').disabled = false
                        document.getElementById('submit_button1.1').disabled = false
                        document.getElementById('submit_button1.2').disabled = false
                        document.getElementById('submit_button1.3').disabled = false
                        document.getElementById('inputDatapackageId').disabled = false
                        document.getElementById('jobNum').disabled = false
                        document.getElementById('inputId').disabled = false
                        document.getElementById('study_name1').disabled = false
                        document.getElementById('study_name2').disabled = false
                        checker1= 0
                    }
                    else {
                        this.state.options.push(JSON.parse(response))
                        fetch(
                            "http://localhost:5000/data", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(obj)
                            })
                            .then(response => response)
                            .catch(error => console.log('Error:',error))
                        document.getElementById('input_button').style.textDecoration = 'none'
                        document.getElementById('output_button').style.textDecoration = 'underline'
                        document.getElementById('area1').style.visibility = 'hidden'
                        document.getElementById('loading1.0').style.visibility = 'hidden'
                        document.getElementById('area2').style.visibility = 'hidden'
                        document.getElementById('area4').style.visibility = 'visible'
                        document.getElementById('success2').style.visibility = 'visible'
                        document.getElementById('submit_button4').style.visibility = 'visible'
                        document.getElementById('loading1.1').style.visibility = 'hidden'
                        document.getElementById('loading1.2').style.visibility = 'hidden'
                        document.getElementById('loading1.3').style.visibility = 'hidden'
                    }
                })
        }
        else if(this.state.dataset_id !== '' && this.state.study_name1 !== ''
            && /^\d+$/.test(this.state.dataset_id) && this.state.study_name1.match("^[A-Za-z0-9]+$")) {
            obj.dataset_id = this.state.dataset_id
            obj.study_name1 = this.state.study_name1
            let array = []
            document.getElementById('loading1.0').style.visibility = 'visible'
            document.getElementById('loading1.0').innerHTML = 'Loading...'
            array.push(this.state.study_name1,this.state.dataset_id)
            fetch("http://localhost:5000/resultsdataset_id", {
                method: 'POST',
                body: array
            })
                .then(response => response.text())
                .then(response => {
                    if(response === 'Error') {
                        document.getElementById('loading1.0').innerHTML = 'File not found. Try again.'
                        document.getElementById('pipeline1.0').disabled = false
                        document.getElementById('submit_button1.1').disabled = false
                        document.getElementById('submit_button1.2').disabled = false
                        document.getElementById('submit_button1.3').disabled = false
                        document.getElementById('inputDatapackageId').disabled = false
                        document.getElementById('jobNum').disabled = false
                        document.getElementById('inputId').disabled = false
                        document.getElementById('study_name1').disabled = false
                        document.getElementById('study_name2').disabled = false
                        checker1= 0
                    }
                    else {
                        this.state.options.push(JSON.parse(response))
                        fetch(
                            "http://localhost:5000/data", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(obj)
                            })
                            .then(response => response)
                            .catch(error => console.log('Error:',error))
                        document.getElementById('input_button').style.textDecoration = 'none'
                        document.getElementById('output_button').style.textDecoration = 'underline'
                        document.getElementById('area1').style.visibility = 'hidden'
                        document.getElementById('loading1.0').style.visibility = 'hidden'
                        document.getElementById('area2').style.visibility = 'hidden'
                        document.getElementById('area4').style.visibility = 'visible'
                        document.getElementById('success2').style.visibility = 'visible'
                        document.getElementById('submit_button4').style.visibility = 'visible'
                        document.getElementById('loading1.1').style.visibility = 'hidden'
                        document.getElementById('loading1.2').style.visibility = 'hidden'
                        document.getElementById('loading1.3').style.visibility = 'hidden'
                    }
                })

        }
        else if(this.state.job_number !== '' && this.state.study_name2 !== ''
            && /^\d+$/.test(this.state.job_number) && this.state.study_name2.match("^[A-Za-z0-9]+$")) {
            obj.job_number = this.state.job_number
            obj.study_name2 = this.state.study_name2
            document.getElementById('loading1.0').style.visibility = 'visible'
            document.getElementById('loading1.0').innerHTML = 'Loading...'
            let array = []
            array.push(this.state.study_name2,this.state.job_number)
            fetch("http://localhost:5000/resultsjob_id", {
                method: 'POST',
                body: array
            })
                .then(response => response.text())
                .then(response => {
                    if(response === 'Error') {
                        document.getElementById('loading1.0').innerHTML = 'File not found. Try again.'
                        document.getElementById('pipeline1.0').disabled = false
                        document.getElementById('submit_button1.1').disabled = false
                        document.getElementById('submit_button1.2').disabled = false
                        document.getElementById('submit_button1.3').disabled = false
                        document.getElementById('inputDatapackageId').disabled = false
                        document.getElementById('jobNum').disabled = false
                        document.getElementById('inputId').disabled = false
                        document.getElementById('study_name1').disabled = false
                        document.getElementById('study_name2').disabled = false
                        checker1= 0
                        checker2 = 1
                    }
                    else {
                        this.state.options.push(JSON.parse(response))
                        fetch(
                            "http://localhost:5000/data", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(obj)
                            })
                            .then(response => response)
                            .catch(error => console.log('Error:',error))
                        document.getElementById('input_button').style.textDecoration = 'none'
                        document.getElementById('output_button').style.textDecoration = 'underline'
                        document.getElementById('area1').style.visibility = 'hidden'
                        document.getElementById('loading1.0').style.visibility = 'hidden'
                        document.getElementById('area2').style.visibility = 'hidden'
                        document.getElementById('area4').style.visibility = 'visible'
                        document.getElementById('success2').style.visibility = 'visible'
                        document.getElementById('submit_button4').style.visibility = 'visible'
                        document.getElementById('loading1.1').style.visibility = 'hidden'
                        document.getElementById('loading1.2').style.visibility = 'hidden'
                        document.getElementById('loading1.3').style.visibility = 'hidden'
                    }
                })


        }
        else {
            window.alert('Please input correctly and try again.')
            return;
        }
        checker1 = 1
        checker2 = 1
        document.getElementById('submit_button1.1').disabled = true
        document.getElementById('pipeline1.0').disabled = true
        document.getElementById('submit_button1.2').disabled = true
        document.getElementById('submit_button1.3').disabled = true
        document.getElementById('inputDatapackageId').disabled = true
        document.getElementById('jobNum').disabled = true
        document.getElementById('inputId').disabled = true
        document.getElementById('study_name1').disabled = true
        document.getElementById('study_name2').disabled = true
    }

    handleDisplay = (event) => {
        event.preventDefault()
        console.log(event.target.id)
        document.getElementById('loading1.0').style.visibility = 'hidden'
        if(this.state.datapackage_id ==='' && this.state.dataset_id ==='' && this.state.job_number ===''
        && this.state.study_name1 ==='' && this.state.study_name2 ==='')
        {
            window.alert('Please fill in something.')
            return
        }
        this.setState({options:[]})
        let obj = {}
        if (event.target.id ==='area1.1' && this.state.datapackage_id !== '') {
            document.getElementById('loading1.1').innerHTML = 'Loading...'
            obj.datapackage_id = this.state.datapackage_id
            document.getElementById('loading1.1').style.visibility = 'visible'
            fetch("http://localhost:5000/datadpkgs", {
                method: 'POST',
                body: this.state.datapackage_id
            })
                .then(response => response.text())
                .then(response => {
                    if (response === 'Error')
                    {
                        document.getElementById('loading1.1').innerHTML =
                            'Error, file not found. Please try again.'
                        document.getElementById('pipeline1.0').disabled = false
                        document.getElementById('submit_button1.1').disabled = false
                        document.getElementById('submit_button1.2').disabled = false
                        document.getElementById('submit_button1.3').disabled = false
                        document.getElementById('inputDatapackageId').disabled = false
                        document.getElementById('jobNum').disabled = false
                        document.getElementById('inputId').disabled = false
                        document.getElementById('study_name1').disabled = false
                        document.getElementById('study_name2').disabled = false
                        checker1 = 0
                        checker2 = 1

                    }
                    else {
                        this.state.options.push(JSON.parse(response))
                        document.getElementById('area1').style.visibility = 'hidden'
                        document.getElementById('pipeline1.0').disabled = false
                        document.getElementById('loading1.1').style.visibility = 'hidden'
                        document.getElementById('loading1.2').style.visibility = 'hidden'
                        document.getElementById('loading1.3').style.visibility = 'hidden'
                        document.getElementById('submit_button1.1').disabled = false
                        document.getElementById('submit_button1.2').disabled = false
                        document.getElementById('submit_button1.3').disabled = false
                        document.getElementById('inputDatapackageId').disabled = false
                        document.getElementById('jobNum').disabled = false
                        document.getElementById('inputId').disabled = false
                        document.getElementById('study_name1').disabled = false
                        document.getElementById('study_name2').disabled = false
                        document.getElementById('area3').style.visibility = 'visible'
                        document.getElementById('success').innerHTML = 'Success! Now please submit ONE .txt file table that you would like to see:'
                        document.getElementById('success').style.visibility = 'visible'
                    }
                })}
        else if (event.target.id === 'area1.2' && this.state.dataset_id !== '' && this.state.study_name1 !== '') {
            document.getElementById('loading1.2').innerHTML = 'Loading...'
            document.getElementById('loading1.2').style.visibility = 'visible'
            if(this.state.dataset_id !== '' && this.state.study_name1 !== '') {
                let array = []
                obj.dataset_id = this.state.dataset_id
                obj.study_name = this.state.study_name1
                array.push(this.state.study_name1,this.state.dataset_id)
                            fetch("http://localhost:5000/datadataset_id", {
                                method: 'POST',
                                body: array
                            })
                                .then(response => response.text())
                                .then(response => {
                                    if (response === 'Error')
                                    {
                                        document.getElementById('loading1.2').innerHTML =
                                            'Error, file not found. Please try again.'
                                        document.getElementById('submit_button1.1').disabled = false
                                        document.getElementById('pipeline1.0').disabled = false
                                        document.getElementById('submit_button1.2').disabled = false
                                        document.getElementById('submit_button1.3').disabled = false
                                        document.getElementById('inputDatapackageId').disabled = false
                                        document.getElementById('jobNum').disabled = false
                                        document.getElementById('inputId').disabled = false
                                        document.getElementById('study_name1').disabled = false
                                        document.getElementById('study_name2').disabled = false
                                        checker1 = 0
                                        checker2 = 1
                                    }
                                    else {
                                        this.state.options.push(JSON.parse(response))
                                        document.getElementById('area1').style.visibility = 'hidden'
                                        document.getElementById('loading1.1').style.visibility = 'hidden'
                                        document.getElementById('loading1.2').style.visibility = 'hidden'
                                        document.getElementById('loading1.3').style.visibility = 'hidden'
                                        document.getElementById('submit_button1.1').disabled = false
                                        document.getElementById('pipeline1.0').disabled = false
                                        document.getElementById('submit_button1.2').disabled = false
                                        document.getElementById('submit_button1.3').disabled = false
                                        document.getElementById('inputDatapackageId').disabled = false
                                        document.getElementById('jobNum').disabled = false
                                        document.getElementById('inputId').disabled = false
                                        document.getElementById('study_name1').disabled = false
                                        document.getElementById('study_name2').disabled = false
                                        document.getElementById('area3').style.visibility = 'visible'
                                        document.getElementById('success').innerHTML = 'Success! Now please submit ONE .txt file table that you would like to see:'
                                        document.getElementById('success').style.visibility = 'visible'
                                    }})
            }
            else {
                document.getElementById('loading1.2').style.visibility = 'hidden'
                window.alert("Please ensure that you have a value in 'dataset ID' and 'study name'.")
                return
            }
        }
        else if (event.target.id === 'area1.3' && this.state.job_number !== '' && this.state.study_name2 !== '') {
            document.getElementById('loading1.3').innerHTML = 'Loading...'
            document.getElementById('loading1.3').style.visibility = 'visible'
            if(this.state.job_number !== '' && this.state.study_name2 !== '') {
                let array = []
                obj.job_number = this.state.job_number
                obj.study_name = this.state.study_name2
                // Since study name doesn't matter at the moment, only pushing
                // job number
                array.push(this.state.study_name2,this.state.job_number)
                fetch("http://localhost:5000/datajob_id", {
                    method: 'POST',
                    body: array
                })
                    .then(response => response.text())
                    .then(response => {
                        if (response === 'Error') {
                            document.getElementById('loading1.3').innerHTML =
                                'Error, file not found. Please try again.'
                            document.getElementById('submit_button1.1').disabled = false
                            document.getElementById('pipeline1.0').disabled = false
                            document.getElementById('submit_button1.2').disabled = false
                            document.getElementById('submit_button1.3').disabled = false
                            document.getElementById('inputDatapackageId').disabled = false
                            document.getElementById('jobNum').disabled = false
                            document.getElementById('inputId').disabled = false
                            document.getElementById('study_name1').disabled = false
                            document.getElementById('study_name2').disabled = false
                            checker1 = 0
                            checker2 = 1
                        }
                        else {
                            this.state.options.push(JSON.parse(response))
                            document.getElementById('area1').style.visibility = 'hidden'
                            document.getElementById('loading1.1').style.visibility = 'hidden'
                            document.getElementById('loading1.2').style.visibility = 'hidden'
                            document.getElementById('loading1.3').style.visibility = 'hidden'
                            document.getElementById('submit_button1.1').disabled = false
                            document.getElementById('submit_button1.2').disabled = false
                            document.getElementById('submit_button1.3').disabled = false
                            document.getElementById('inputDatapackageId').disabled = false
                            document.getElementById('jobNum').disabled = false
                            document.getElementById('inputId').disabled = false
                            document.getElementById('study_name1').disabled = false
                            document.getElementById('study_name2').disabled = false
                            document.getElementById('area3').style.visibility = 'visible'
                            document.getElementById('success').innerHTML = 'Success! Now please submit ONE .txt file table that you would like to see:'
                            document.getElementById('success').style.visibility = 'visible'
                            document.getElementById('pipeline1.0').disabled = false
                        }})
            }
            else {
                document.getElementById('loading1.3').style.visibility = 'hidden'
                window.alert("Please ensure that you have a value in 'job number' and 'study name'.")
                return
            }
        }
        else {
            window.alert('Wrong Display button clicked.')
            document.getElementById('loading1.1').style.visibility = 'hidden'
            document.getElementById('loading1.2').style.visibility = 'hidden'
            document.getElementById('loading1.3').style.visibility = 'hidden'
            return
        }
        checker1=1
        checker2 = 1
        document.getElementById('submit_button1.1').disabled = true
        document.getElementById('pipeline1.0').disabled = true
        document.getElementById('submit_button1.2').disabled = true
        document.getElementById('submit_button1.3').disabled = true
        document.getElementById('inputDatapackageId').disabled = true
        document.getElementById('jobNum').disabled = true
        document.getElementById('inputId').disabled = true
        document.getElementById('study_name1').disabled = true
        document.getElementById('study_name2').disabled = true
        //Emptying options just in case user wants to chose another directory to receive files from

    }

    // Puts files into selectedFiles
    handleFileChange = event => {
        this.setState({
            selectedFiles: event.target.files,
        })
    }

    handleFileSubmit = (event) => {
        event.preventDefault()
        let fileData = new FormData()
        // Loops to insert the file and filename of each file in selectedFiles into FormData()
        // If statement is to check file extensions and act accordingly
        if (this.state.selectedFiles.length !== 4){
            window.alert("Only submit a total of 4 files. Please select the files again.")
            document.getElementById('inputFiles').value = null
            return
        }
        let txt = 0, raw =0, fasta = 0
        for (let i = 1; i < this.state.selectedFiles.length + 1; i++) {
            let ext = this.state.selectedFiles[i - 1].name.split('.').pop()
            if (ext !== "txt" && ext !== "fasta" && ext !== "raw") {
                window.alert("You can only upload parameter files[.txt], protein files[.fasta] " +
                    "and mass spectrometer output files[.raw]. Please select the files again.")
                document.getElementById('inputFiles').value = null
                return
            } else {
                if(ext ==='txt') {
                    txt++
                }
                if(ext ==='raw') {
                    raw++
                }
                if(ext ==='fasta') {
                    fasta++
                }
                if(txt !== 2 && raw !== 1 && fasta !==1){
                    window.alert("Make sure to only upload 1 raw, 2 txt, and 1 fasta file. " +
                        "Please select the files again.")
                    document.getElementById('inputFiles').value = null
                    return;
                }
            }
            fileData.append('file' + i.toString(), this.state.selectedFiles[i - 1])
            fileData.append('filename' + i.toString(), this.state.selectedFiles[i - 1].name)
        }
        this.setState({options:[]})
        checker1=1
        checker2 =1
        document.getElementById('loading2').innerHTML = 'Loading...'
        document.getElementById('loading2').style.visibility = 'visible'
        document.getElementById('submit_button2').disabled = true
        document.getElementById('inputFiles').disabled = true
        this.setState({options:[]})
        fetch(
            "http://localhost:5000/files", {
                method: 'POST',
                body: fileData,
            })
            .then(response => response.text())
            .then(response =>{
                this.state.options.push(JSON.parse(response))
                document.getElementById('input_button').style.textDecoration = 'none'
                document.getElementById('output_button').style.textDecoration = 'underline'
                document.getElementById('submit_button2').disabled = false
                document.getElementById('inputFiles').disabled = false
                document.getElementById('loading2').style.visibility = 'hidden'
                document.getElementById('area2').style.visibility = 'hidden'
                document.getElementById('area4').style.visibility = 'visible'
                document.getElementById('success2').style.visibility = 'visible'
                document.getElementById('submit_button4').style.visibility = 'visible'
            })
            .catch((error) => {
                console.error('Error:', error)
                document.getElementById('loading2').innerHTML = "Error, " +
                    "please make sure 'results.json' is in json format or empty and try again"
                document.getElementById('submit_button2').disabled = false
                document.getElementById('inputFiles').disabled = false
                checker1 = 0
            })


    }


    handleDropDownChange =(optionsChosen) => {
        this.setState({optionsChosen})
    }


    handleMultiSubmit = (event) => {
        event.preventDefault()
        if (this.state.optionsChosen[0] === undefined) {
            window.alert("Please select some file(s)")
            return
        }
        document.getElementById('data_success').style.visibility = 'hidden'
        document.getElementById('p_table').style.visibility = 'hidden'
        document.getElementById('table').style.visibility = 'hidden'
        document.getElementById('tsv').style.visibility = 'hidden'
        document.getElementById('submit_button3').disabled = true
        document.getElementById('submit_button4').disabled = true
        document.getElementById('loading3').innerHTML = 'Loading...'
        document.getElementById('loading3').style.visibility = 'visible'
        document.getElementById('pic_div1').style.visibility = 'hidden'
        document.getElementById('pic_div2').style.visibility = 'hidden'
        this.setState({file_rows:[],file_columns:[], file_data:[]})
        let self = this
        fetch(
            "http://localhost:5000/dropdown_submit", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; ' +
                        'charset = utf-8'
                },
                body: JSON.stringify(this.state.optionsChosen),
            })
            .then(function (response) {
                if (response.status === 200 || response.status === 0) {
                    return Promise.resolve(response.blob());
                } else {
                    return Promise.reject(new Error(response.statusText));
                }
            })
            .then(JSZip.loadAsync)
            .then(function(zip) {
                for (let index in zip.files) {
                    let file_name = zip.file(index).name.split("/").pop()
                    if(file_name.includes('error.txt')) {
                        document.getElementById('loading3').innerHTML =
                            'Error, please submit the allowed file(s).'
                        document.getElementById('submit_button3').disabled = false
                        document.getElementById('submit_button4').disabled = false
                        checker1 =1
                        checker2 =1
                        return
                    }
                    if(file_name.includes('.txt')){
                        self.state.file_data.push({file_name:file_name,file_data:zip.file(index).async('string')})
                    }
                    if (file_name.includes(".tsv")){
                        self.state.file_data.push({file_name:file_name,file_data:zip.file(index).async('string')})
                    }
                    if (file_name.includes(".png") || file_name.includes(".jpg")){
                        self.state.file_data.push({file_name:file_name,file_data:zip.file(index).async('base64')})
                    }
                }
            })
            .then(() => {
                let png_number = 1
                for (let i =0; i <this.state.file_data.length;i++) {
                    Promise.resolve(this.state.file_data[i]['file_data'])
                        .then(data => {
                                if (this.state.file_data[i]['file_name'].includes('.txt')) {
                                    console.log('TXT')
                                    let result = []
                                    let lines = data.toString().split('\n')
                                    const headers = lines[0].split(/\s+/)
                                    for (let j = 0; j < headers.length; j++) {
                                        if (headers[j] !== "")
                                            this.state.file_columns.push({Header: headers[j], accessor: headers[j], width: 125})
                                    }
                                    for (let k = 1; k < lines.length; k++) {
                                        let obj = {id: k}
                                        let current_line = lines[k].split(/\s+/)
                                        for (let m = 0; m < headers.length; m++) {
                                            if (current_line[m]!=="")
                                                obj[headers[m]] = current_line[m]
                                        }
                                    result.push(obj)
                                    }
                                    this.setState({file_rows:result})
                                    document.getElementById('loading3').style.visibility = 'hidden'
                                    document.getElementById('success').innerHTML = 'Feel free to look at another text file.'
                                    document.getElementById('submit_button3').disabled = false
                                    document.getElementById('submit_button4').disabled = false
                                    document.getElementById('table').style.visibility = 'visible'
                                    checker1 = 1
                                    checker2 = 1
                                }
                                if (this.state.file_data[i]['file_name'].includes(".tsv")) {
                                    console.log('TSV')
                                    let result = []
                                    let lines = data.toString().split('\n')
                                    const headers = lines[0].split(/\s+/)
                                    for (let j = 0; j < headers.length; j++) {
                                        if (headers[j] !== "")
                                            this.state.file_columns.push({Header: headers[j], accessor: headers[j], width: 125})
                                    }
                                    for (let k = 1; k < lines.length; k++) {
                                        let obj = {id: k}
                                        let current_line = lines[k].split(/\s+/)
                                        for (let m = 0; m < headers.length; m++) {
                                            if (current_line[m]!=="")
                                                obj[headers[m]] = current_line[m]
                                        }
                                    result.push(obj)
                                    }
                                    this.setState({file_rows: result})
                                    document.getElementById('success2').innerHTML = 'Feel free to choose 1 .tsv' +
                                        ' and/or up to 2 .png/jpg again'
                                    document.getElementById('data_success').style.visibility = 'visible'
                                    document.getElementById('p_table').style.visibility = 'visible'
                                    document.getElementById('submit_button4').disabled = false
                                    document.getElementById('submit_button3').disabled = false
                                    document.getElementById('loading3').style.visibility = 'hidden'
                                    document.getElementById('tsv').style.visibility = 'visible'
                                    checker1=0
                                    checker2=0
                                }
                                if (this.state.file_data[i]['file_name'].includes(".png") ||
                                this.state.file_data[i]['file_name'].includes(".jpg")) {
                                    console.log('PNG/JPG')
                                    if (png_number === 1) {
                                        self.state.pic1.alt = this.state.file_data[i]['file_name']
                                        self.state.pic1.src = "data:image/png;base64," + data
                                        self.state.pic1.onload = function () {
                                            document.getElementById('pic1').src = self.state.pic1.src
                                        }
                                        document.getElementById('success2').innerHTML = 'Feel free to choose 1 .tsv' +
                                        ' and/or up to 2 .png/jpg again'
                                        document.getElementById('data_success').style.visibility = 'visible'
                                        document.getElementById('pic_div1').style.visibility = 'visible'

                                        png_number++
                                        checker1=0
                                        checker2 = 0
                                    } else {
                                        self.state.pic2.alt = this.state.file_data[i]['file_name']
                                        self.state.pic2.src = "data:image/png;base64," + data
                                        self.state.pic2.onload = function () {
                                            document.getElementById('pic2').src = self.state.pic2.src
                                        }
                                        document.getElementById('pic_div2').style.visibility = 'visible'
                                    }
                                    document.getElementById('submit_button4').disabled = false
                                    document.getElementById('submit_button3').disabled = false
                                    document.getElementById('loading3').style.visibility = 'hidden'

                                }

                            }
                        )
                }
            }
                )
            .catch((error) => {
                console.error('Error:', error)
            })

}


    handleFileDownload = (event) => {
        event.preventDefault()
        let blob
        console.log(event.target.id)
        if (event.target.id === 'download1') {
            Promise.resolve(this.state.file_data[0]['file_data'])
                .then(data => {
                    blob = new Blob([data], {type: "text/plain;charset=utf-8"})
                    saveAs(blob, this.state.file_data[0]['file_name'])
                })
        }
        if (event.target.id === 'download2') {
            for (let i = 0; i < this.state.file_data.length; i++) {
                if (this.state.file_data[i]['file_name'].includes('.tsv')) {
                    Promise.resolve(this.state.file_data[i]['file_data'])
                        .then(data => {
                            blob = new Blob([data], {type: "text/plain;charset=utf-8"})
                            saveAs(blob, this.state.file_data[i]['file_name'])
                        })
                    return
                }
            }
        }
        if(event.target.id === 'download3' || event.target.id === 'download4') {
            for (let i = 0; i < this.state.file_data.length; i++) {
                if (this.state.file_data[i]['file_name'].includes('.png') ||
                this.state.file_data[i]['file_name'].includes('.jpg')) {
                    if(event.target.id === 'download3') {
                        saveAs(this.state.pic1.src, this.state.pic1.alt)
                        return
                    }
                    if(event.target.id === 'download4') {
                        saveAs(this.state.pic2.src,this.state.pic2.alt)
                        return
                    }
                }
            }
        }
    }


    render() {
        return (
<div>



   <div id="area0">
      <header className="header">
         <p className="headerTitle">MetaProteomics </p>
         <div className="dropdown">
            <button id = 'input_button' onClick={this.handleInputButton} className="button" style={{'text-decoration':'underline'}}>Input</button>
            <div className="dropdown-content">
               <a href="#" onClick={this.handlePNNLButton}>PNNL</a>
               <a href="#" onClick={this.handleNMDCButton}>NMDC</a>
            </div>
         </div>
         <button id='output_button' onClick={this.handleOutputButton} className="button">Output</button>
      </header>
   </div>



   <div id="area1" className='area1'>
      <p style={{'font': 'bold 15px Comic Sans MS'}}>
      You have selected the 'PNNL' option to run the MetaProteomics internally.
      <br/>Fill in only ONE section below, then click 'Run Pipeline',
          <br/>
          or click the section's 'Display' button to view its pre-analyzed data instead.
          <br/>
          <br/>
      </p>


         <form id='area1.1' onSubmit={this.handleDisplay} style={{'float':'left','display':'inline-block','margin':'0 12px 0 0',
         'border':'5px outset #1C2C58','-webkit-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)','-mox-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)'}}>
            <p style={{'font':'20px Comic Sans MS','margin':"0",'padding':'5px','paddingBottom':'-10px','lineHeight':'40px','display':'block'}}>
                Enter the datapackage ID (ETA: ~10-15min)</p>
            <input
               type="text"
               name="datapackage_id"
               id="inputDatapackageId"
               onChange={this.handleChange}
               className="custom_box"
               pattern="[0-9]{1,}"
               title="0-9"
               />
            <p style={{'font':'12px Times New Roman','margin':"0",'padding':'5px'}}>Must only include integers 0-9, no decimal points</p>
            <input className={'submit1'}
            id = "submit_button1.1"
            type="submit"
            value="Display"
            />
            <div id='loading1.1' style={{'visibility':'hidden', 'margin':'0 25px','padding':'10px','font':'15px Comic Sans MS','verticalAlign':'top'}}>Loading...</div>
         </form>
         <form id='area1.2' onSubmit={this.handleDisplay} style={{'float':'left','display':'inline-block','margin':'0 20px 0 0',
         'border':'5px outset #1C2C58','-webkit-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)','-mox-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)'}}>
            <p style={{'font':'20px Comic Sans MS','margin':"3px",'lineHeight':'40px'}}>Enter the dataset ID (ETA: ~2-3min)</p>
            <input type="text"
               name="dataset_id"
               id="inputId"
               onChange={this.handleChange}
               className="custom_box"
               pattern="[0-9]{1,}"
               title="0-9"
               />
            <p style={{'font':'12px Times New Roman','margin':"0",'padding':'5px'}}>Must only include integers 0-9, no decimal points</p>
            <label>
            <p style={{'font':'20px Comic Sans MS','margin':"3px",'lineHeight':'40px'}}>Enter the study name</p>
            <input type="text"
               name="study_name1"
               id="study_name1"
               onChange={this.handleChange}
               className="custom_box"
               pattern="[a-zA-Z0-9 ]{1,}"
               title="A-Z,a-z,0-9, ' '"
               />
            <p style={{'font':'12px Times New Roman','margin':"0",'padding':'5px'}}>Must only letters and/or integers 0-9, no decimal points</p>
            </label>
            <input className={'submit1'}
            id = "submit_button1.2"
            type="submit"
            value="Display"
            />
            <div id='loading1.2' style={{'visibility':'hidden', 'margin':'0 25px','padding':'10px','font':'15px Comic Sans MS','verticalAlign':'top'}}>Loading...</div>
         </form>
          <form id='area1.3' onSubmit={this.handleDisplay} style={{'float':'left','display':'inline-block','margin':'0 20px 0 0',
          'border':'5px outset #1C2C58','-webkit-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)','-mox-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)'}}>
            <p style={{'font':'20px Comic Sans MS','margin':"0",'padding':'5px','lineHeight':'40px'}}>Enter the job number (ETA: ~2-3min)</p>
            <input
               type="text"
               name="job_number"
               id="jobNum"
               onChange={this.handleChange}
               className="custom_box"
               pattern="[0-9]{1,}"
               title="0-9"
               />
            <p style={{'font':'12px Times New Roman','margin':"0",'padding':'5px'}}>Must only include integers 0-9, no decimal points</p>
            <label>
            <p style={{'font':'20px Comic Sans MS','margin':"3px",'lineHeight':'40px'}}>Enter the study name</p>
            <input type="text"
               name="study_name2"
               id="study_name2"
               onChange={this.handleChange}
               className="custom_box"
               pattern="[a-zA-Z0-9]{1,}"
               title="A-Z,a-z,0-9"
               />
            <p style={{'font':'12px Times New Roman','margin':"0",'padding':'5px'}}>Must only include letters and/or integers 0-9, no decimal points</p>
            </label>
            <input className={'submit1'}
            id = "submit_button1.3"
            type="submit"
            value="Display"
            />
            <div id='loading1.3' style={{'visibility':'hidden', 'margin':'0 25px','padding':'10px','font':'15px Comic Sans MS','verticalAlign':'top'}}>Loading...</div>
          </form>
           <button id = 'pipeline1.0' onClick={this.handleInternalPipe}
                   style={{'border':'5px outset black','-webkit-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)',
                       '-mox-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)','margin-top':'-20px'}}
            className={"pipeline"}>Run Pipeline
           <div id='loading1.0' style={{'visibility':'hidden','display':'inline-block', 'margin':'0 25px','padding':'10px','font':'20px Comic Sans MS','verticalAlign':'center'}}>Loading...</div>
           </button>
   </div>

    <div id="area2" className='area2' style={{'border':'5px outset black','-webkit-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)','-mox-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)'}}>
        <p style={{'font': 'bold 15px Comic Sans MS'}}>
            You have selected the 'NMDC' option to run the MetaProteomics externally.
            <br/>In order to do so, please upload one of each file asked below:
            <br/>
            <br/>-Raw (.raw)
            <br/>-MSGF+ Parameter (.txt)
            <br/>-MASIC Parameter (.txt)
            <br/>-FASTA (.fasta)
        </p>

        <form id='area2.1' onSubmit={this.handleFileSubmit} style={{'border':'5px outset #1C2C58','-webkit-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)','-mox-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)'}}>
            <p style={{'font':'19px Comic Sans MS','margin':"0",'padding':'5px','lineHeight':'40px'}}>
                Please select up to 4 files
                (instead of clicking once to select one file,
                hold the CTRL button before clicking each file in order to select multiple at the same time):
                <br/>
                        <input type="file"
                               className="custom_upload"
                               id="inputFiles"
                               onChange={this.handleFileChange}
                               multiple
                               required
                               title=".txt .fasta. or .raw"
                        />
            </p>
                        <br/>
                        <input className={'pipeline'}
                               style={{'border':'5px outset black','-webkit-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)',
                       '-mox-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)','margin-top':'-20px',
                               'width':'250px','height':'75px'}}
                           id = "submit_button2"
                           type="submit"
                           value="Run Pipeline"
                        />
                        <div id='loading2' style={{'visibility':'hidden','display':'inline-block', 'margin':'0 25px','padding':'10px','font':'20px Comic Sans MS','verticalAlign':'top'}}>Loading...</div>
        </form>
    </div>

    <div id='area3' className='area3'>
        <form onSubmit={this.handleMultiSubmit} style={{'width':'100%','maxWidth':'1270px'}}>
                    <p id = 'success' style={{'font':'20px Comic Sans MS','margin':"0",'padding':'5px'}}>
                        Success! Now please submit ONE .txt file table that you would like to see:
                    </p>
                    <MultiLevelSelect
                    id = "select"
                    options={this.state.options}
                    name = "optionsChosen"
                    onChange = {this.handleDropDownChange}
                    />
                    <input className={'submit2'}
                           type="submit"
                           value="Submit"
                           id = "submit_button3"
                    />
                    <div id='loading3' style={{'visibility':'hidden', 'margin':'0 25px','font':'20px Comic Sans MS','paddingLeft': '175px','paddingTop':'10px'}}>Loading...</div>
        </form>
            <div id="table" style={{'width':'100%','maxWidth':'1250px','maxHeight':'100%','visibility':'hidden'}}>
                <p style={{'font':'20px Comic Sans MS','margin':"0",'padding':'5px'}}>
                    Table created!
                    <br/>
                    Along with filtering/sorting features, you can stretch the column names
                    to reveal the longer values in the corresponding column.
                    <br/>
                    <br/>
                </p>
                <p style={{'font':'20px Comic Sans MS','margin':"0",'paddingLeft':'5px',"display":'inline-block'}}>
                    Or download the table
                </p>
                <button id="download1" onClick={this.handleFileDownload} className={"download_link"}>here</button>
                <br/>
                <br/>
                <input className={'submit3'}
                       type="button"
                       value="Go Back to PNNL Options"
                       id = "back_button"
                       onClick={this.handlePNNLButton}
                />
                <br/>
                <br/>
                <ReactTable
                    style={{'border':'5px outset #1C2C58','-webkit-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)','-mox-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)'}}
                    data={this.state.file_rows} columns = {this.state.file_columns} defaultPageSize = {10}
                    showPagination={true}
                    showPageSizeOptions={true}
                    showPageJump={true}
                    showPaginationBottom={true}
                    showPaginationTop={true}
                    resizable={true}
                    filterable={true}
                    sortable={true}
                    pageSizeOptions = {[10,25, 50,100,250,500,1000,2000,3000,4000,5000,10000,25000,50000]}/>
            </div>
    </div>

    <div id='area4' className='area4'>
        <form onSubmit={this.handleMultiSubmit} style={{'width':'100%','maxWidth':'1270px'}}>
            <p id = 'success2' style={{'font':'20px Comic Sans MS','margin':"0",'padding':'5px'}}>
                Pipeline completed! Now please select up to 1 .tsv and/or 2 .png/.jpg
                to view at a time.
            </p>
            <MultiLevelSelect
                id = "select2"
                options={this.state.options}
                name = "optionsChosen"
                onChange = {this.handleDropDownChange}
            />
            <input className={'submit2'}
                   type="submit"
                   value="Submit"
                   id = "submit_button4"
            />
        </form>
        <div id="tsv" style={{'width':'100%','maxWidth':'1250px','maxHeight':'100%','visibility':'hidden'}}>
            <br/>
                <p id='data_success'
                    style={{'font':'20px Comic Sans MS','margin':"0",'padding':'5px','visibility':'hidden'}}>
                    Data retrieved! Scroll down to see them all. (Table might take a few seconds longer to load)
                    <br/>
                    <br/>
                </p>
                <p id="p_table"
                    style={{'font':'20px Comic Sans MS','margin':"0",'paddingLeft':'5px','visibility':'hidden'}}>
                    For tables, along with filtering/sorting features, you can stretch the column names
                    to reveal the longer values in the corresponding column.
                    <br/>
                </p>
                <p style={{'font':'20px Comic Sans MS','margin':"0",'paddingLeft':'5px',"display":'inline-block'}}>
                    Or download the table
                </p>
                <button id="download2" onClick={this.handleFileDownload} className={"download_link"}>here</button>
                <br/>
                <br/>
                <br/>
                <ReactTable
                    style={{'position':'relative','border':'5px outset #1C2C58','-webkit-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)','-mox-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)'}}
                    data={this.state.file_rows} columns = {this.state.file_columns} defaultPageSize = {10}
                    showPagination={true}
                    showPageSizeOptions={true}
                    showPageJump={true}
                    showPaginationBottom={true}
                    showPaginationTop={true}
                    resizable={true}
                    filterable={true}
                    sortable={true}
                    pageSizeOptions = {[10,25, 50,100,250,500,1000,2000,3000,4000,5000,10000,25000,50000]}/>
            </div>
        <div id="pic_div1" style={{'visibility':'hidden','width':'45%','maxWidth:':'200','float':'left',
        'border':'5px outset #1C2C58','-webkit-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)','-mox-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)'}}>
            <p style={{'font':'20px Comic Sans MS','margin':"0",'paddingLeft':'5px',"display":'inline-block'}}>
                Or download the picture
            </p>
            <button id="download3" onClick={this.handleFileDownload} className={"download_link"}>here</button>
            <img src={this.state.pic1} id = {'pic1'} alt={'PNG/JPG 1'}/>
        </div>
        <div id="pic_div2" style={{'visibility':'hidden','width':'45%','maxWidth:':'200px','float':'right',
            'border':'5px outset #1C2C58','-webkit-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)','-mox-box-shadow':'5px 5px 15px rgba(0,0,0,0.4)'}}>
            <p style={{'font':'20px Comic Sans MS','margin':"0",'paddingLeft':'5px',"display":'inline-block'}}>
                Or download the picture
            </p>
            <button id="download4" onClick={this.handleFileDownload} className={"download_link"}>here</button>
            <img src={this.state.pic2} id = {'pic2'} alt={'PNG/JPG 2'}/>
        </div>
    </div>
</div>
        )
    }
}


const mapStateToProps = (state) => {
    return{
        user: state.user,
        math: state.math
    };
};

const mapDispatchToProps = (dispatch) => {
    return{
        setName: (name) => {
            dispatch({
                type: "SET_NAME",
                payload: name
            })
        }
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(App)
