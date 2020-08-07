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

let file_data = [], pic1,pic2, checker1 = 0, checker2 = 0, multisel_checker = 0


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
            file_columns: []
        }


        this.handleInputButton = this.handleInputButton.bind(this)
        this.handleOutputButton = this.handleOutputButton.bind(this)
        this.handlePNNLButton = this.handlePNNLButton.bind(this)
        this.handleNMDCButton = this.handleNMDCButton.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleFileSubmit = this.handleFileSubmit.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this)
        this.handleDropDownChoice = this.handleDropDownChoice.bind(this)
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
            document.getElementById('area1').style.visibility = 'hidden'
            document.getElementById('area2').style.visibility = 'hidden'
            document.getElementById('submit_button2').disabled = false
    }

    handleOutputButton = (event) => {
        /*
        event.preventDefault()
        if(checker2 !== 1) {
            window.alert('Please use the program all the way first.')
            return
        }
        for (let i = 0;i<file_data.length;i++){

            if(file_data[i]['file_name'].includes('csv')) {
                document.getElementById('csv').style.visibility = 'visible'
            }
            else {
                document.getElementById('picture1').style.visibility = 'visible'
                document.getElementById('picture1').style.visibility = 'hidden'
        }
        }



        document.getElementById('area1').style.visibility = 'hidden'
        document.getElementById('area2').style.visibility = 'hidden'
        document.getElementById('area3').style.visibility = 'visible'
         */
    }

    handlePNNLButton = (event) => {
        event.preventDefault()
            if (checker1 === 1 && event.target.id !=='back_button') {
                window.alert('Please use the program all the way first.')
                return
            }
            if (event.target.id ==='back_button') {
                checker1--
            }
            document.getElementById('area1').style.visibility = 'visible'
            document.getElementById('area2').style.visibility = 'hidden'
            document.getElementById('area3').style.visibility = 'hidden'
            document.getElementById('table').style.visibility = 'hidden'
            document.getElementById('success').style.visibility = 'hidden'
            document.getElementById('loading1.2').style.visibility = 'hidden'
            document.getElementById('loading1.2').style.visibility = 'hidden'
            document.getElementById('loading1.2').style.visibility = 'hidden'
    }

    handleNMDCButton = (event) => {
        event.preventDefault()
        if(checker1 === 1) {
            window.alert('Please use the program all the way first.')
            return
        }
        document.getElementById('area1').style.visibility = 'hidden'
        document.getElementById('area2').style.visibility = 'visible'
        document.getElementById('loading2').style.visibility = 'hidden'
    }

    // Will update the "name" value with whatever value has been inserted in "name" box
    handleChange = ({target}) => {
        this.setState({[target.name]: target.value})
    }

    handleSubmit = (event) => {
        event.preventDefault()
        console.log(event.target.id)
        if(this.state.datapackage_id ==='' && this.state.dataset_id ==='' && this.state.job_number ===''
        && this.state.study_name1 ==='' && this.state.study_name2 ==='')
        {
            window.alert('Please fill in something.')
            return
        }
        this.setState({options:[]})
        let obj = {}
        if (event.target.id ==='area1.1') {
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
                            'Error, no datapackage ID found. Please try again.'
                        document.getElementById('submit_button1.1').disabled = false
                        document.getElementById('submit_button1.2').disabled = false
                        document.getElementById('submit_button1.3').disabled = false
                        document.getElementById('inputDatapackageId').disabled = false
                        document.getElementById('jobNum').disabled = false
                        document.getElementById('inputId').disabled = false
                        document.getElementById('study_name1').disabled = false
                        document.getElementById('study_name2').disabled = false
                        checker1 = 0
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
                    }
                })}
        if (event.target.id === 'area1.2') {
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
                                            'Error, no dataset_id/study name combo found. Please try again.'
                                        document.getElementById('submit_button1.1').disabled = false
                                        document.getElementById('submit_button1.2').disabled = false
                                        document.getElementById('submit_button1.3').disabled = false
                                        document.getElementById('inputDatapackageId').disabled = false
                                        document.getElementById('jobNum').disabled = false
                                        document.getElementById('inputId').disabled = false
                                        document.getElementById('study_name1').disabled = false
                                        document.getElementById('study_name2').disabled = false
                                        checker1 = 0
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
                                    }})
            }
            else {
                document.getElementById('loading1.2').style.visibility = 'hidden'
                window.alert("Please ensure that you have a value in 'dataset ID' and 'study name'.")
                return
            }
        }
        if (event.target.id === 'area1.3') {
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
                                'Error, no job_number/study name combo found. Please try again.'
                            document.getElementById('submit_button1.1').disabled = false
                            document.getElementById('submit_button1.2').disabled = false
                            document.getElementById('submit_button1.3').disabled = false
                            document.getElementById('inputDatapackageId').disabled = false
                            document.getElementById('jobNum').disabled = false
                            document.getElementById('inputId').disabled = false
                            document.getElementById('study_name1').disabled = false
                            document.getElementById('study_name2').disabled = false
                            checker1 = 0
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
                        }})
            }
            else {
                document.getElementById('loading1.3').style.visibility = 'hidden'
                window.alert("Please ensure that you have a value in 'job number' and 'study name'.")
                return
            }
        }
        checker1=1
        document.getElementById('submit_button1.1').disabled = true
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
                /*
                if(txt !== 2 && raw !== 1 && fasta !==1){
                    window.alert("Make sure to only upload 1 raw, 2 txt, and 1 fasta file. " +
                        "Please select the files again.")
                    document.getElementById('inputFiles').value = null
                    return;
                }

                 */
            }
            fileData.append('file' + i.toString(), this.state.selectedFiles[i - 1])
            fileData.append('filename' + i.toString(), this.state.selectedFiles[i - 1].name)
        }
        this.setState({options:[]})
        checker1=1
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
            .then(response => response)
            .then(fileData => {
                document.getElementById('loading2').innerHTML = 'Almost finished...'
                console.log('Success:', fileData)
                fetch("http://localhost:5000/dropdown")
                    .then(response => response.text())
                    .then((text) => {
                        this.handleDropDownChoice(event,text)
                        document.getElementById('area2').style.visibility = 'hidden'
                        document.getElementById('loading2').style.visibility = 'hidden'
                        document.getElementById('loading2').innerHTML = 'Loading...'
                        document.getElementById('inputFiles').disabled = false
                        document.getElementById('inputFiles').value = null
                        document.getElementById('submit_button2').disabled = false
                        document.getElementById('area3').style.visibility = 'visible'
            })})
            .catch((error) => {
                console.error('Error:', error)
                document.getElementById('loading2').innerHTML = "Error, " +
                    "please make sure 'results.json' is in json format or empty and try again"
                document.getElementById('submit_button2').disabled = false
                document.getElementById('inputFiles').disabled = false
            })


    }


    // String of file names will be sorted into their correct DropDown location
    handleDropDownChoice = (event, text) => {
        text = text.split(" ")
        for (let i = 0; i < text.length; i++) {
            if (text[i].includes('!')) {
                text[i] = text[i].replace('!','')
                this.setState({
                    options: this.state.options.concat({value: text[i],label:text[i]})
                })
            }
            if (text[i].includes('?')){
                text[i] = text[i].replace('?','')
                this.setState({
                    options :this.state.options.concat(
                        this.state.options[0].options.push({value: text[i],label:text[i]}))
                })
            }
            if (text[i].includes('$')){
                text[i] = text[i].replace('$','')
                this.setState({
                    options :this.state.options.concat(
                        this.state.options[1].options.push({value: text[i],label:text[i]}))
                })
            }
        }
        for (let i = 0; i < this.state.options.length;i++) {
            if (!isNaN(this.state.options[i])) {
                this.state.options.splice(i)
            }
        }
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
        document.getElementById('table').style.visibility = 'hidden'
        document.getElementById('submit_button3').disabled = true
        document.getElementById('loading3').innerHTML = 'Loading...'
        document.getElementById('loading3').style.visibility = 'visible'
        file_data = []
        this.setState({file_rows:[],file_columns:[]})
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
                            'Error, please submit ONE TEXT file from this directory please.'
                        document.getElementById('submit_button3').disabled = false
                        return
                    }
                    if(file_name.includes('.txt')){
                        file_data.push({file_name:file_name,file_data:zip.file(index).async('string')})
                    }
                    if (file_name.includes(".csv")){
                        file_data.push({file_name:file_name,file_data:zip.file(index).async('string')})
                    }
                    if (file_name.includes(".png")){
                        file_data.push({file_name:file_name,file_data:zip.file(index).async('base64')})
                    }
                }
            })
            .then(() => {
                let png_number = 1
                for (let i =0; i <file_data.length;i++) {
                    Promise.resolve(file_data[i]['file_data'])
                        .then(data => {
                                if (file_data[i]['file_name'].includes('.txt')) {
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
                                    document.getElementById('success').innerHTML = 'Feel free to look at another text file.'
                                    document.getElementById('submit_button3').disabled = false
                                    document.getElementById('loading3').style.visibility = 'hidden'
                                    document.getElementById('table').style.visibility = 'visible'
                                }
                                if (file_data[i]['file_name'].includes(".csv")) {
                                    console.log('CSV')
                                    let result = []
                                    let lines = data.toString().split('\n')
                                    const headers = lines[0].split(",")
                                    for (let j = 0; j < headers.length; j++) {
                                        this.state.file_columns.push({Header: headers[j], accessor: headers[j], width: 200})
                                    }
                                    for (let k = 1; k < lines.length; k++) {
                                        let obj = {id: k}
                                        let current_line = lines[k].split(",")
                                        for (let m = 0; m < headers.length; m++) {
                                            obj[headers[m]] = current_line[m]
                                        }
                                        result.push(obj)
                                    }
                                    this.setState({file_rows: result[0]})
                                }
                                if (file_data[i]['file_name'].includes(".png")) {
                                    console.log('PNG')
                                    if (png_number === 1) {
                                        pic1 = new Image()
                                        pic1.src = "data:image/png;base64," + data
                                        pic1.onload = function () {
                                            //document.getElementById('png1').src = pic1.src
                                        }
                                        //document.getElementById('picture1').style.visibility = 'visible'
                                        png_number++
                                    } else {
                                        pic2 = new Image()
                                        pic2.src = "data:image/png;base64," + data
                                        pic2.onload = function () {
                                            //    document.getElementById('png2').src = pic2.src
                                        }
                                        //document.getElementById('picture2').style.visibility = 'visible'
                                    }
                                }

                            }
                        )
                }})
            .catch((error) => {
                console.error('Error:', error)
            })

}


    handleFileDownload = (event) => {
        event.preventDefault()
        let blob
        for (let i = 0; i<file_data.length; i++) {
            if(file_data[i]['file_name'].includes('.txt')){
                Promise.resolve(file_data[i]['file_data'])
                    .then(data => {
                        blob = new Blob([data], {type:"text/plain;charset=utf-8"})
                        saveAs(blob,file_data[i]['file_name'])
                    })
                return
            }
            console.log('A')
        }
        console.log('B')
    }



    render() {
        return (
<div>



   <div id="area0">
      <header className="header">
         <p className="headerTitle">MetaProteomics </p>
         <div className="dropdown">
            <button onClick={this.handleInputButton} className="button">Input</button>
            <div className="dropdown-content">
               <a href="#" onClick={this.handlePNNLButton}>PNNL</a>
               <a href="#" onClick={this.handleNMDCButton}>NMDC</a>
            </div>
         </div>
         <button onClick={this.handleOutputButton} className="button">Output</button>
      </header>
   </div>



   <div id="area1" className='area1'>
      <p style={{'font': 'bold 15px Comic Sans MS'}}>
      You have selected the 'PNNL' option to run the MetaProteomics internally.
      <br/>Fill in only one section below, then click 'Submit' to view data.
          <br/>There are 3 possible sections one can fill out or you can run the pipeline below.
          <br/>
          <br/>
          <button className={"pipeline"}>Run Pipeline</button>

      </p>


         <form id='area1.1' onSubmit={this.handleSubmit}>
            <p style={{'font':'20px Comic Sans MS','margin':"0",'padding':'5px','paddingBottom':'-10px','lineHeight':'40px'}}>
                Enter the datapackage ID (ETC: ~10-15min)</p>
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
            <div id='loading1.1' style={{'visibility':'hidden','display':'inline-block', 'margin':'0 25px','padding':'10px','font':'20px Comic Sans MS','verticalAlign':'top'}}>Loading...</div>
         </form>
         <p style={{'font':'20px Comic Sans MS','margin':"3px",'lineHeight':'40px'}}>---------------OR---------------</p>


         <form id='area1.2' onSubmit={this.handleSubmit}>
            <p style={{'font':'20px Comic Sans MS','margin':"3px",'lineHeight':'40px'}}>Enter the dataset ID (ETC: ~1-2min)</p>
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
            <div id='loading1.2' style={{'visibility':'hidden','display':'inline-block', 'margin':'0 25px','padding':'10px','font':'20px Comic Sans MS','verticalAlign':'top'}}>Loading...</div>
         </form>


         <p style={{'font':'20px Comic Sans MS','margin':"3px",'lineHeight':'40px'}}>---------------OR---------------</p>


          <form id='area1.3' onSubmit={this.handleSubmit}>
            <p style={{'font':'20px Comic Sans MS','margin':"0",'padding':'5px','lineHeight':'40px'}}>Enter the job number(ETC: ~1-2min)</p>
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
            <div id='loading1.3' style={{'visibility':'hidden','display':'inline-block', 'margin':'0 25px','padding':'10px','font':'20px Comic Sans MS','verticalAlign':'top'}}>Loading...</div>
         </form>
   </div>

    <div id="area2" className='area2'>
        <p style={{'font': 'bold 15px Comic Sans MS'}}>
            You have selected the 'NMDC' option to run the MetaProteomics externally.
            <br/>In order to do so, please upload one of each file asked below:
            <br/>
            <br/>-Raw (.raw)
            <br/>-MSAF Parameter (.txt)
            <br/>-MASIC Parameter (.txt)
            <br/>-FASTA (.fasta)
        </p>

        <form id='area2.1' onSubmit={this.handleFileSubmit}>
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
                    <div id='loading3' style={{'visibility':'hidden', 'margin':'0 25px','font':'20px Comic Sans MS','paddingTop':'10px','paddingLeft': '175px'}}>Loading...</div>
        </form>
            <div id="table" style={{'width':'100%','maxWidth':'1250px','maxHeight':'100%','visibility':'hidden'}}>
                <p style={{'font':'20px Comic Sans MS','margin':"0",'padding':'5px'}}>
                    Table created!
                    <br/>
                    Along with filtering/sorting features, you can stretch the column names
                    to reveal the longer values in the corresponding column.
                    <br/>
                </p>
                <p style={{'font':'20px Comic Sans MS','margin':"0",'paddingLeft':'5px',"display":'inline-block'}}>
                    Or download it
                </p>
                <button onClick={this.handleFileDownload} className={"download_link"}>here</button>
                <br/>
                <br/>
                <input className={'submit3'}
                       type="button"
                       value="Go Back to PNNL Options"
                       id = "back_button"
                       onClick={this.handlePNNLButton}
                />
                <br/>
                <ReactTable
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