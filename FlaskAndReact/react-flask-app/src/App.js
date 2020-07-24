import React from 'react';
import MultiLevelSelect from 'react-multi-level-selector'
import './App.css';
import JSZip from 'jszip';
import ReactTable from "react-table-v6";
import "react-table-v6/react-table.css";
import 'react-tabulator/lib/styles.css';
import {saveAs} from "file-saver"
let file_data

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



        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this)
        this.handleDropDownChoice = this.handleDropDownChoice.bind(this)
        this.handleDropDownChange = this.handleDropDownChange.bind(this)
        this.handleSecondSubmit = this.handleSecondSubmit.bind(this)
    }

    // Will update the "name" value with whatever value has been inserted in "name" box
    handleChange = ({target}) => {
        this.setState({[target.name]: target.value})
    }

    handleSubmit = (event) => {
        event.preventDefault()
        console.log(this.state.selectedFiles)
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
        let obj = {}
        obj.dataset_name = this.state.dataset_name
        obj.dataset_id = this.state.dataset_id
        document.getElementById('submit_button1').disabled = true
        document.getElementById('inputName').disabled = true
        document.getElementById('inputId').disabled = true
        document.getElementById('inputFiles').disabled = true
        // Uses a POST request to send obj as a JSON string
        document.getElementById('loading_or_fail').innerHTML = "Loading..."
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
        console.log(this.state.optionsChosen[0])
        if (this.state.optionsChosen[0] === undefined) {
            window.alert("Please select some file(s)")
            return
        }
        document.getElementById('loading').innerHTML = "Loading..."
        document.getElementById('submit_button2').disabled = true

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
            .then()
            .then(JSZip.loadAsync)
            .then(function(zip) {
                console.log(typeof zip,zip)
                for (let index in zip.files) {
                    return zip.file(index).async("string")
                }
            })

            .then((text) => {
                file_data = text
                let lines = text.toString().split("\n")
                let result = []
                let headers = lines[0].split(",")
                for (let i = 0; i< headers.length;i++) {
                    this.state.file_columns.push({Header : headers[i], accessor: headers[i], width: 250})
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
                let zip1 = new JSZip()
                    zip1.file("a_file.csv",`${text}`);
                    zip1.generateAsync({type: 'blob'}).then(
                        function (content) {
                            saveAs(content, "download.zip")
                        }
                    )
                    saveAs(text,'a_file.csv')

            })

            .then(() => document.getElementById('area2').style.visibility = 'hidden')
            .then(() => document.getElementById('area3').style.visibility = 'visible')
            .catch((error) => {
                console.error('Error:', error)
            })

}
    
    render() {
        return (
            <div>
                <header className="header">
                    <p className="headerTitle">Proteomics </p>
                    <button  className="button">Input</button>
                    <button className="button">Output</button>
                </header>
                <label style={{"display":"block"}}>
                    <p style={{"display":"inline-block","textAlign":"center","font":"20px Arial Black"}}>
                        Or download it&nbsp;
                    </p>
                    <a className="download_link" target="_blank" download>
                        here
                    </a>
                        </label>
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

                <form style={{'border': 'solid'}} onSubmit={this.handleSecondSubmit} id="area2" className={"area2"}>
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

                        <ReactTable data={this.state.file_rows} columns = {this.state.file_columns} defaultPageSize = {10}
                                showPagination={true}
                                showPaginationBottom={true}
                                showPaginationTop={true}
                                resizable={true}
                                filterable={true}
                                sortable={true}
                                pageSizeOptions = {[25,50,100,250,500,1000,2000,3000,4000,5000,10000]}/>
                    </div>

            </div>
        )
    }
}

export default App
