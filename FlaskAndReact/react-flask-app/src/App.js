import React from 'react';
import MultiLevelSelect from 'react-multi-level-selector'
import './App.css';
import JSZip from 'jszip';
//FIXME: v7 doesn't work, but v6 does
// yarn v1.22.4
import ReactTable from "react-table-v6";
import "react-table-v6/react-table.css"
import {saveAs} from "file-saver"
let file_data, file_name, pic, checker1 = 0, checker2 = 0

//TODO: Maybe not multiselector, fix removing pic when clicking input, and fix download png, maybe at go back to pick file,
// maybe add dpkgs name too

// Maybe add a Start Over button that refreshes page
class App extends React.Component {

    constructor(props) {
        super(props)
        // Sets the variables that each front-end instance will have
        this.state = {
            dataset_name: '',
            dataset_id: '',
            selectedFiles: null,
            options: [{value: 'data', label: 'data', options: []},
                {value: 'plots', label: 'plots', options: []}],
            optionsChosen: [],
            file_rows: [],
            file_columns: []
        }


        this.handleInputButton = this.handleInputButton.bind(this)
        this.handleOutputButton = this.handleOutputButton.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this)
        this.handleDropDownChoice = this.handleDropDownChoice.bind(this)
        this.handleDropDownChange = this.handleDropDownChange.bind(this)
        this.handleSecondSubmit = this.handleSecondSubmit.bind(this)
        this.handleFileDownload = this.handleFileDownload.bind(this)
    }

    handleInputButton = (event) => {
        event.preventDefault()
        if(checker1 !== 1) {
            window.alert('Please use the program all the way first.')
            return
        }
        document.getElementById('submit_button1').disabled = false
        document.getElementById('inputName').disabled = false
        document.getElementById('inputId').disabled = false
        document.getElementById('inputFiles').disabled = false
        document.getElementById('area1').style.visibility = 'visible'
        document.getElementById('area2').style.visibility = 'hidden'
        document.getElementById('area3').style.visibility = 'hidden'
        document.getElementById('loading_or_fail').innerHTML = ""
        document.getElementById('loading').innerHTML = ""
        document.getElementById('submit_button2').disabled = false
        document.getElementById('csv').style.visibility = 'hidden'
        document.getElementById('png').style.visibility = 'hidden'

    }

    handleOutputButton = (event) => {
        event.preventDefault()
        if(checker2 !== 1) {
            window.alert('Please use the program all the way first.')
            return
        }
        if(file_name.includes(".csv")) {
            document.getElementById('csv').style.visibility = 'visible'
        }
        else {
            document.getElementById('png').style.visibility = 'visible'
        }
        document.getElementById('area1').style.visibility = 'hidden'
        document.getElementById('area2').style.visibility = 'hidden'
        document.getElementById('area3').style.visibility = 'visible'
    }

    // Will update the "name" value with whatever value has been inserted in "name" box
    handleChange = ({target}) => {
        this.setState({[target.name]: target.value})
    }

    handleSubmit = (event) => {
        event.preventDefault()
        for (let i = 1; i < this.state.selectedFiles.length + 1; i++) {
        }
        let fileData = new FormData()
        // Loops to insert the file and filename of each file in selectedFiles into FormData()
        // If statement is to check file extensions and act accordingly
        if (this.state.selectedFiles.length > 4){
            window.alert("Only submit a maximum of 4 files. Please select the files again.")
            document.getElementById('inputFiles').value = null
            return
        }

        for (let i = 1; i < this.state.selectedFiles.length + 1; i++) {
            let ext = this.state.selectedFiles[i - 1].name.split('.').pop()
            if (ext !== "txt" && ext !== "fasta" && ext !== "raw") {
                window.alert("You can only upload parameter files[.txt], protein files[.fasta] " +
                    "and mass spectrometer output files[.raw]. Please select the files again.")
                document.getElementById('inputFiles').value = null
                console.log(this.state.selectedFiles)
                return
            }
            fileData.append('file' + i.toString(), this.state.selectedFiles[i - 1])
            fileData.append('filename' + i.toString(), this.state.selectedFiles[i - 1].name)
        }
        document.getElementById('submit_button1').disabled = true
        document.getElementById('inputName').disabled = true
        document.getElementById('inputId').disabled = true
        document.getElementById('inputFiles').disabled = true
        document.getElementById('loading_or_fail').innerHTML = "Loading..."
        checker1= 0
        checker2=0
        //Emptying options just in case user wants to chose another directory to receive files from
        this.setState({options:[{value: 'data', label: 'data', options: []},
                {value: 'plots', label: 'plots', options: []}]})
        let obj = {}
        obj.dataset_name = this.state.dataset_name
        obj.dataset_id = this.state.dataset_id
        // Uses a POST request to send obj as a JSON string

        fetch(
            "http://localhost:5000/data", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            })
            .then(response => response.json())
            .then(obj => {
                console.log('Success:', obj)
            })
            .catch((error) => {
                console.error('Error:', error)
            })
        // Uses a POST request to send the FormData containing the files
        fetch(
            "http://localhost:5000/files", {
                method: 'POST',
                body: fileData,
            })
            .then(response => response)
            .then(fileData => {
                console.log('Success:', fileData)
                fetch("http://localhost:5000/dropdown").then(response => response.text())
                    .then(text => this.handleDropDownChoice(event,text))
                    .then(() => document.getElementById('success').innerHTML = "Success! Now please select " +
                    "the csv/png files that you would like to see:")
                    .then(() => document.getElementById('area1').style.visibility = 'hidden')
                    .then(() => document.getElementById('area2').style.visibility = 'visible')

            })
            .catch((error) => {
                console.error('Error:', error)
                document.getElementById('loading_or_fail').innerHTML = "Error, " +
                    "please make sure 'results.json' is in json format or empty and try again"
                document.getElementById('submit_button1').disabled = false
                document.getElementById('inputName').disabled = false
                document.getElementById('inputId').disabled = false
                document.getElementById('inputFiles').disabled = false
            })


    }

    // Adds a file to the array of files in selectedFiles
    handleFileChange = event => {
        this.setState({
            selectedFiles: event.target.files,
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


    handleSecondSubmit = (event) => {
        event.preventDefault()
        if (this.state.optionsChosen[0] === undefined) {
            window.alert("Please select some file(s)")
            return
        }
        document.getElementById('loading').innerHTML = "Loading..."
        document.getElementById('submit_button2').disabled = true
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
                    file_name = zip.file(index).name.split("/").pop()
                    if (file_name.includes(".csv")){
                        return zip.file(index).async("string")
                    }
                    else{
                        return zip.file(index).async("base64")
                    }
                }
            })
            .then((text) => {
                if(file_name.includes(".csv")){
                    file_data = text
                    let result = []
                    const lines = text.toString().split("\n")
                    const headers = lines[0].split(",")
                    for (let i = 0; i< headers.length;i++) {
                        this.state.file_columns.push({Header : headers[i], accessor: headers[i]})
                    }
                    for(let i = 1; i< lines.length;i++){
                       let obj = {id:i}
                       let currentline = lines[i].split(",")
                        for (let j = 0 ; j<headers.length;j++) {
                            obj[headers[j]] = currentline[j]
                        }
                        result.push(obj)
                    }
                    this.setState({file_rows: result})
                    document.getElementById('csv').style.visibility = 'visible'
                }
                else {
                    pic = new Image()
                    pic.src = "data:image/png;base64," + text
                    pic.onload = function() {
                        document.getElementById('png').src = pic.src
                    }
                }

                document.getElementById('area2').style.visibility = 'hidden'
                document.getElementById('area3').style.visibility = 'visible'
            })
            .catch((error) => {
                console.error('Error:', error)
            })
        checker1 = 1
        checker2= 1
}

    handleFileDownload = (event) => {
        event.preventDefault()
        let blob
        if(file_name.includes(".csv")){
            blob = new Blob([file_data],{type:"text/plain;charset=utf-8"})
            saveAs(blob,file_name)
        }
        else {
            saveAs(pic.src,file_name)
        }

    }

    
    render() {
        return (
            <div>
                <header className="header">
                    <p className="headerTitle">Proteomics </p>
                    <button onClick={this.handleInputButton} className="button">Input</button>
                    <button onClick={this.handleOutputButton} className="button">Output</button>
                </header>
                <form onSubmit={this.handleSubmit} id = "area1" className={"area1"}>
                    <label>
                        <p style={{'font':'20px Comic Sans MS','margin':"0",'padding':'5px','lineHeight':'40px'}}>Enter the Dataset Name</p>
                        <input
                               type="text"
                               name="dataset_name"
                               id="inputName"
                               onChange={this.handleChange}
                               className="custom_box"
                               pattern="[a-zA-Z0-9-_]{1,}"
                               title="A-Z, a-z , 0-9 , _ , -"
                               required
                        />
                        <p style={{'font':'12px Times New Roman','margin':"0",'padding':'5px'}}>Must only include letters, numbers, underscores ( _ ),
                            and/or hyphens ( - )</p>
                    </label>
                    <label>
                        <p style={{'font':'20px Comic Sans MS','margin':"3px",'lineHeight':'40px'}}>Enter the Dataset ID</p>
                        <input type="text"
                               name="dataset_id"
                               id="inputId"
                               onChange={this.handleChange}
                               className="custom_box"
                               pattern="[0-9]{1,}"
                               title="0-9"
                               required
                        />
                        <p style={{'font':'12px Times New Roman','margin':"0",'padding':'5px'}}>Must only include integers 0-9, no decimal points</p>
                    </label>
                    <label style={{'font':'20px Comic Sans MS','margin':"0",'padding':'5px','lineHeight':'40px'}}>
                        Please select up to 4 files:
                        <input type="file"
                               className="custom_upload"
                               id="inputFiles"
                               onChange={this.handleFileChange}
                               multiple
                               required
                               title=".txt .fasta. or .raw"
                        />
                        <p style={{'font':'12px Times New Roman','margin':"0",'padding':'5px'}}>Only upload parameter files[.txt], protein files[.fasta]
                    and mass spectrometer output files[.raw]</p>

                    </label>
                    <input style={{'fontSize': '20px','position':'relative','top':'10px'}}
                           id = "submit_button1"
                           type="submit"
                           value="Submit"
                    />
                    <p style={{'font':'20px Comic Sans MS','margin':"0",'padding':'15px'}} id = "loading_or_fail"/>
                </form>

                <form onSubmit={this.handleSecondSubmit} id="area2" className={"area2"}>
                    <p style={{'font':'20px Comic Sans MS','margin':"0",'padding':'5px'}}
                        id="success"/>
                    <MultiLevelSelect
                    id = "select"
                    options={this.state.options}
                    name = "optionsChosen"
                    onChange = {this.handleDropDownChange}
                    />
                    <input style={{'fontSize': '20px','position':'relative','top':'10px'}}
                           type="submit"
                           value="Submit"
                           id = "submit_button2"
                    />
                    <p id = "loading" style={{'font':'20px Comic Sans MS','margin':"0",'padding':'15px'}}/>
                </form>
                    <div className="area3" id="area3">
                        <p style={{"display":"inline-block","font":"bold 20px Comic Sans MS", "margin":"0"}}>
                            Or download it
                        </p>
                        <button onClick={this.handleFileDownload} className="download_link">
                            here
                        </button>
                        <div id="csv" style={{"position":"absolute","visibility":"hidden"}}>
                        <ReactTable
                                data={this.state.file_rows} columns = {this.state.file_columns} defaultPageSize = {25}
                                showPagination={true}
                                showPageSizeOptions={true}
                                showPageJump={true}
                                showPaginationBottom={true}
                                showPaginationTop={true}
                                resizable={true}
                                filterable={true}
                                sortable={true}
                                pageSizeOptions = {[25, 50,100,250,500,1000,2000,3000,4000,5000,10000,25000,50000]}/>
                        </div>
                        <img src={pic} id="png" alt = {file_name}/>
                    </div>
            </div>
        )
    }
}

export default App
