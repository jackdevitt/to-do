import React from "react";
import ConfettiBurst from './ConfettiBurst.js'
import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("priorityRoot"));
let data;
let filter = "";
let completedTitle = "Task";
let grabData = true;
let formScreenEdit = false;
let formScreenAdd = false;
let showCompleted = false;
let showFinished = false;
let restoreTitle = "Task";
let restoreConfirmation = false;
//let scrolledToBottom = false;

let tempID = 0;
let tempName = "";
let tempDesc = "";
let tempPriority = null;

let confirmedID = 0;
let confirmedName = "";
let confirmedDesc = "";
let confirmedPriority = null;

/*
let count = 21;

window.addEventListener('scroll', function() {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight && !scrolledToBottom) {
        count += 21;
        grabData = true;
        root.render(<App />);
        scrolledToBottom = true;
    } else if (window.innerHeight + window.pageYOffset + 50 <= document.body.offsetHeight) {
        scrolledToBottom = false;
    }
});
*/

document.getElementById("returnHome").addEventListener("click", function () {
    window.sessionStorage.setItem("user-id", "");
    window.location.href = "/";
});

document.getElementById("todoTab").addEventListener("click", function () {
    showCompleted = false;
    grabData = true;
    root.render(<App />);
});

document.getElementById("completedTab").addEventListener("click", function () {
    showCompleted = true;
    grabData = true;
    root.render(<App />);
});

document.getElementById("searchbar").addEventListener("input", function () {
    filter = document.getElementById("searchbar").value;
    grabData = true;
    root.render(<App />);
});

document.getElementById("create").addEventListener("click", function() {
    formScreenAdd = true;
    root.render(<App />)
});

function removeItem(id) {
    let req = new XMLHttpRequest();
    req.open("DELETE", `http://localhost:8080/removeItem/${id}`, true)
    req.onload = function() {
        grabData = true;
        root.render(<App />)
    }
    req.send();
}

function handleScroll (event) {
    console.log("scroll")
    const target = event.target;

    if (target.scrollHeight - target.scrollTop === target.clientHeight) {
        console.log("End of page")
    }
}

function restore(id, name, desc, status) {
    console.log(id, name, desc, status)
    let req = new XMLHttpRequest();
    req.open("PATCH", `http://localhost:8080/updateItem/${id}`)
    req.onload = function() {
        grabData = true;
        restoreConfirmation = false;
        root.render(<App />);
    }
    req.send(JSON.stringify({"name": name, "desc": desc, "status": false, "completed": false}));
}

function changePriority(id, name, desc, status) {
    let req = new XMLHttpRequest();
    req.open("PATCH", `http://localhost:8080/updateItem/${id}`, true)
    req.onload = function() {
        grabData = true;
        root.render(<App />)
    }
    req.send(JSON.stringify({"name": name, "desc": desc, "topPriority": !status}));
}

function restoreTask(id, title, desc, status) {
    confirmedID = id;
    confirmedName = title;
    confirmedDesc = desc;
    confirmedPriority = status;

    restoreTitle = title;
    restoreConfirmation = true;
    root.render(<App />)
}


const PercentageBar = ({ value, total }) => {
    const [percentage, setPercentage] = useState((value / total) * 100);
  
    const barStyle = {
      width: `${percentage}%`,
      background: `rgb(34, 201, 112)`,
      transition: 'width 0.5s',
    };
  
    return (
      <div className="percentage-bar">
        <div className="bar" style={barStyle}></div>
        <span className="percentage">{`${percentage.toFixed(2)}%`}</span>
      </div>
    );
};

const ConfettiOverlay = ({ onConfettiComplete }) => {
    const [showConfetti, setShowConfetti] = useState(true);
  
    useEffect(() => {
      const confettiTimer = setTimeout(() => {
        setShowConfetti(false);
        onConfettiComplete();
      }, 10000); // Adjust the duration of the confetti burst here
  
      return () => {
        clearTimeout(confettiTimer);
      };
    }, [onConfettiComplete]);
  
    return (
      <div className="confetti-overlay">
        {showConfetti && <ConfettiBurst />}
      </div>
    );
};

const App = () => {
    document.getElementById("header").style.display = "flex";
    const [name, setName] = useState(null)
    const [description, setDescription] = useState(null)
    const [priority, setPriority] = useState(null)

    const [showConfetti, setShowConfetti] = useState(false);

    const completeItem = (id, name, desc, priority) => {
        setShowConfetti(true);
        let req = new XMLHttpRequest();
        req.open("PATCH", `http://localhost:8080/updateItem/${id}`, true)
        req.onload = function() {
            grabData = true;
            showFinished = true;
            completedTitle = name;
            root.render(<App />)
        }
        req.send(JSON.stringify({"name": name, "desc": desc, "topPriority": priority, "completed": true}));
    }

    const exitForm = () => {
        setName(null);
        setDescription(null);
        setPriority(null);
        
        restoreConfirmation = false;
        formScreenEdit = false;
        formScreenAdd = false;
        showFinished = false;
        root.render(<App />);
    }

    const handleEdit = (event) => {
        event.preventDefault();

        if (name != null) {
            tempName = name;
        }
        if (description != null) {
            tempDesc = description;
        }
        if (priority != null) {
            tempPriority = priority;
        }

        let req = new XMLHttpRequest();
        req.open("PATCH", `http://localhost:8080/updateItem/${tempID}`);
        req.onload = function() {
            setName(null);
            setDescription(null);
            setPriority(null);
    
            formScreenEdit = false;
            grabData = true;
            root.render(<App />)
        }
        req.send(JSON.stringify({"name": tempName, "desc": tempDesc, "topPriority": tempPriority}));
    }

    const handleAdd = (event) => {
        event.preventDefault();

        let newDesc = description;
        let newPriority = priority;

        if (description == null || description == "") {
            newDesc = "no description";
        }
        if (priority == null) {
            newPriority = false
        }

        let req = new XMLHttpRequest();
        req.open("POST", `http://localhost:8080/addItem`);
        req.setRequestHeader("User-Id", parseInt(window.sessionStorage.getItem("user-id")));
        req.onload = function() {
            setName(null);
            setDescription(null);
            setPriority(null);
    
            showCompleted = false;
            formScreenAdd = false;
            grabData = true;
            root.render(<App />)
        }
        req.send(JSON.stringify({"name": name, "desc": newDesc, "topPriority": newPriority}));
    }

    const handleConfettiComplete = () => {
        setShowConfetti(false);
        console.log(showConfetti);
    }

    if (grabData) {
        getData(function(value) {
            console.log(value);
            data = JSON.parse(value);
            grabData = false;
            root.render(<App />);
        });
    }
    if (data != null) {

        let count = 0;
        for (let i = 0; i < data.Items.length; i++) {
            if (!showCompleted) {
                if (data.Items[i]["completed"] == false) {
                    count++;
                }
            } else {
                if (data.Items[i]["completed"] == true) {
                    count++;
                }
            }
        }
        document.getElementById("title").textContent = `(${count})`
        if (count == 0 && !formScreenAdd && filter != "") {
            return (
                <h1 className = "pageDescription">No Items found</h1>
            );
        }
        if (!showCompleted) {
            document.getElementById("todoTab").style.fontWeight = "bold";
            document.getElementById("completedTab").style.fontWeight = "lighter";
            const insertion = data.Items.map(function(item) {
                if (item["topPriority"] == true && item["completed"] == false) {
                    return (
                        <div className="task">
                            <h3>{item["name"]}</h3>
                            <p>{item["desc"]}</p>
                            <div className="buttons">
                                <button onClick={() => showFormEdit(item["id"], item["name"], item["desc"], item["topPriority"])}><img src = "edit.png" width = "40px" height = "40px"/></button>
                                <button onClick={() => removeItem(item["id"])}><img src = "trash.png" width = "40px" height = "40px" /></button>
                            </div>
                            <button className = "completeButton" onClick = {() => completeItem(item["id"], item["name"], item["desc"], item["topPriority"])}><img src = "complete.png" width = "40px" height = "40px" /></button>
                            <button className = "priorityButton" onClick = {() => changePriority(item["id"], item["name"], item["desc"], item["topPriority"])}><img className = "priorityImage" src = "Star.png" width = "35px" height = "35px"/></button>
                        </div>
                    );
                }
            });
            const normalInsertion = data.Items.map(function(item) {
                if (item["topPriority"] == false && item["completed"] == false) {
                    return (
                        <div className="task">
                            <h3>{item["name"]}</h3>
                            <p>{item["desc"]}</p>
                            <div className="buttons">
                                <button onClick={() => showFormEdit(item["id"], item["name"], item["desc"], item["topPriority"])}><img src = "edit.png" width = "40px" height = "40px"/></button>
                                <button onClick={() => removeItem(item["id"])}><img src = "trash.png" width = "40px" height = "40px" /></button>
                            </div>
                            <button className = "completeButton" onClick = {() => completeItem(item["id"], item["name"], item["desc"], item["topPriority"])}><img src = "complete.png" width = "40px" height = "40px" /></button>
                            <button className = "priorityButton" onClick = {() => changePriority(item["id"], item["name"], item["desc"], item["topPriority"])}><img className = "priorityImage" src = "uncheckedStar.png" width = "35px" height = "35px"/></button>
                        </div>
                    );
                }
            });
            if (showFinished) {
                let completedCount = 0;
                let activeCount = 0;
                for (let i = 0; i < data.Items.length; i++) {
                    if (data.Items[i]["completed"] == true) {
                        completedCount++;
                    }
                    activeCount++;
                }
                let percentage = Math.round((10 * ((completedCount / activeCount) * 100)) / 10) + "%"
                return (
                    <div className = "formContainer">
                        <div><h1 className = "percentCount">{percentage}</h1><PercentageBar className = "percentDisplay" value = {completedCount} total = {activeCount}/></div>
                        <div id = "confetti-container">{<ConfettiOverlay onConfettiComplete={handleConfettiComplete}/>}</div>
                        <div className="blurCover"></div>
                        <div className="grid-container priority-grid">{insertion}{normalInsertion}</div>
                        <div className = "form">
                            <h1 className = "title">Congrats on completing the task: {"\n"} {completedTitle}!</h1>
                            <br />
                            <br />
                            <br />
                            <button onClick = {() => exitForm()}className = "input-submit">Ok</button>
                            <button className = "exitForm" onClick={() => exitForm()}><img src = "back.png" width = "50px" height = "50px"/></button>
                        </div>
                    </div>
                );
            }
            if (formScreenEdit) {
                let completedCount = 0;
                let activeCount = 0;
                for (let i = 0; i < data.Items.length; i++) {
                    if (data.Items[i]["completed"] == true) {
                        completedCount++;
                    }
                    activeCount++;
                }
                let percentage = Math.round((10 * ((completedCount / activeCount) * 100)) / 10) + "%"
                return (
                    <div className = "formContainer">
                        <div><h1 className = "percentCount">{percentage}</h1><PercentageBar className = "percentDisplay" value = {completedCount} total = {activeCount}/></div>
                        <div className="grid-container priority-grid">{insertion}{normalInsertion}</div>
                        <div className="blurCover"></div>
                        <div className = "form">
                            <button className = "exitForm" onClick={() => exitForm()}><img src = "back.png" width = "50px" height = "50px"/></button>
                            <form className = "editForm" onSubmit={handleEdit}>
                                <h1 className = "title">Edit</h1>
                                <br />
                                <br />
                                <br />
                                <label className = "label">
                                    Name
                                    <br />
                                    <input placeholder = {tempName} id = "nameEdit" className = "input-text" type = "text" name = "rawText" onChange={(event) => setName(event.target.value)}></input>
                                </label>
                                <br />
                                <br />
                                <label className = "label">
                                    Description
                                    <br />
                                    <input placeholder = {tempDesc} id = "descEdit" className = "input-text" type = "text" name = "rawDesc" onChange={(event) => setDescription(event.target.value)}></input>
                                </label>
                                <br />
                                <br />
                                <label className = "label">
                                    Top Priority
                                    <br />
                                    <input checked = {tempPriority} id = "priorityEdit" className = "input-check" type = "checkbox" name = "rawPriority" onChange = {function(event) {setPriority(event.target.checked); tempPriority = event.target.checked; root.render(<App />)}}></input>
                                </label>
                                <br />  
                                <br />
                                <br />
                                <input type = "submit" className = "input-submit"></input>
                            </form>
                        </div>
                    </div>
                );
            }
            if (formScreenAdd) {
                let completedCount = 0;
                let activeCount = 0;
                for (let i = 0; i < data.Items.length; i++) {
                    if (data.Items[i]["completed"] == true) {
                        completedCount++;
                    }
                    activeCount++;
                }
                let percentage = Math.round((10 * ((completedCount / activeCount) * 100)) / 10) + "%"
                return (
                    <div className = "formContainer">
                        <div><h1 className = "percentCount">{percentage}</h1><PercentageBar className = "percentDisplay" value = {completedCount} total = {activeCount}/></div>
                        <div className="grid-container priority-grid">{insertion}{normalInsertion}</div>
                        <div className="blurCover"></div>
                        <div className = "form">
                            <button className = "exitForm" onClick={() => exitForm()}><img src = "back.png" width = "50px" height = "50px"/></button>
                            <form className = "editForm" onSubmit={handleAdd}>
                                <h1 className = "title">Create</h1>
                                <br />
                                <br />
                                <br />
                                <label className = "label">
                                    Name
                                    <br />
                                    <input required placeholder = "name" id = "nameEdit" className = "input-text" type = "text" name = "rawText" onChange={(event) => setName(event.target.value)}></input>
                                </label>
                                <br />
                                <br />
                                <label className = "label">
                                    Description
                                    <br />
                                    <input placeholder = "description" id = "descEdit" className = "input-text" type = "text" name = "rawDesc" onChange={(event) => setDescription(event.target.value)}></input>
                                </label>
                                <br />
                                <br />
                                <label className = "label">
                                    Top Priority
                                    <br />
                                    <input id = "priorityEdit" className = "input-check" type = "checkbox" name = "rawPriority" onChange = {function(event) {setPriority(event.target.checked)}}></input>
                                </label>
                                <br />  
                                <br />
                                <br />
                                <input type = "submit" className = "input-submit"></input>
                            </form>
                        </div>
                    </div>
                );
            }
            if (count == 0) {
                return <h1 className = "pageDescription">You're all caught up!</h1>;
            }
            let completedCount = 0;
            let activeCount = 0;
            for (let i = 0; i < data.Items.length; i++) {
                if (data.Items[i]["completed"] == true) {
                    completedCount++;
                }
                activeCount++;
            }
            let percentage = Math.round((10 * ((completedCount / activeCount) * 100)) / 10) + "%"
            return <div><div><h1 className = "percentCount">{percentage}</h1><PercentageBar className = "percentDisplay" value = {completedCount} total = {activeCount}/></div><div className="grid-container priority-grid">{insertion}{normalInsertion}</div></div>;
        } else {
            document.getElementById("todoTab").style.fontWeight = "lighter";
            document.getElementById("completedTab").style.fontWeight = "bold";
            if (count == 0) {
                return <h1 className = "pageDescription">You have not completed a task yet</h1>
            } else {
                const insertion = data.Items.map(function(item) {
                    if (item["completed"] == true) {
                        return (
                            <div className="task">
                                <h3>{item["name"]}</h3>
                                <p>{item["desc"]}</p>
                                <button id = "restoreButton" onClick = {() => restoreTask(item["id"], item["name"], item["desc"], item["topPriority"])}><img src = "revert.png" width = "40px" height = "40px"></img></button>
                            </div>
                        );
                    }
                });
                if (formScreenAdd) {
                    let completedCount = 0;
                    let activeCount = 0;
                    for (let i = 0; i < data.Items.length; i++) {
                        if (data.Items[i]["completed"] == true) {
                            completedCount++;
                        }
                        activeCount++;
                    }
                    let percentage = Math.round((10 * ((completedCount / activeCount) * 100)) / 10) + "%"
                    return (
                        <div className = "formContainer">
                            <div><h1 className = "percentCount">{percentage}</h1><PercentageBar className = "percentDisplay" value = {completedCount} total = {activeCount}/></div>
                            <div className="grid-container priority-grid">{insertion}</div>
                            <div className="blurCover"></div>
                            <div className = "form">
                                <button className = "exitForm" onClick={() => exitForm()}><img src = "back.png" width = "50px" height = "50px"/></button>
                                <form className = "editForm" onSubmit={handleAdd}>
                                    <h1 className = "title">Create</h1>
                                    <br />
                                    <br />
                                    <br />
                                    <label className = "label">
                                        Name
                                        <br />
                                        <input required placeholder = "name" id = "nameEdit" className = "input-text" type = "text" name = "rawText" onChange={(event) => setName(event.target.value)}></input>
                                    </label>
                                    <br />
                                    <br />
                                    <label className = "label">
                                        Description
                                        <br />
                                        <input placeholder = "description" id = "descEdit" className = "input-text" type = "text" name = "rawDesc" onChange={(event) => setDescription(event.target.value)}></input>
                                    </label>
                                    <br />
                                    <br />
                                    <label className = "label">
                                        Top Priority
                                        <br />
                                        <input id = "priorityEdit" className = "input-check" type = "checkbox" name = "rawPriority" onChange = {function(event) {setPriority(event.target.checked)}}></input>
                                    </label>
                                    <br />  
                                    <br />
                                    <br />
                                    <input type = "submit" className = "input-submit"></input>
                                </form>
                            </div>
                        </div>
                    );
                }
                if (restoreConfirmation) {
                    let completedCount = 0;
                    let activeCount = 0;
                    for (let i = 0; i < data.Items.length; i++) {
                        if (data.Items[i]["completed"] == true) {
                            completedCount++;
                        }
                        activeCount++;
                    }
                    let percentage = Math.round((10 * ((completedCount / activeCount) * 100)) / 10) + "%"
                    return (
                        <div className = "formContainer">
                            <div><h1 className = "percentCount">{percentage}</h1><PercentageBar className = "percentDisplay" value = {completedCount} total = {activeCount}/></div>
                            <div className="blurCover"></div>
                            <div className="grid-container priority-grid">{insertion}</div>
                            <div className = "form">
                                <h1 className = "title">Are you sure you want to restore: {"\n"} {restoreTitle}!</h1>
                                <br />
                                <br />
                                <br />
                                <div className = "confirmationContainer">
                                    <button onClick = {() => restore(confirmedID, confirmedName, confirmedDesc, confirmedPriority)} className = "confirmRestore">Confirm</button>
                                    <button onClick = {() => exitForm()} className = "cancelRestore">Cancel</button>
                                </div>
                                <button className = "exitForm" onClick={() => exitForm()}><img src = "back.png" width = "50px" height = "50px"/></button>
                            </div>
                        </div>
                    );
                }
                let completedCount = 0;
                let activeCount = 0;
                for (let i = 0; i < data.Items.length; i++) {
                    if (data.Items[i]["completed"] == true) {
                        completedCount++;
                    }
                    activeCount++;
                }
                let percentage = Math.round((10 * ((completedCount / activeCount) * 100)) / 10) + "%"
                return <div><div><h1 className = "percentCount">{percentage}</h1><PercentageBar className = "percentDisplay" value = {completedCount} total = {activeCount}/></div><div className="grid-container priority-grid">{insertion}</div></div>
            }
        }
    } else {
        return <div></div>
    }
}


function showFormEdit(id, name, desc, priority) {
    formScreenEdit = true;
    tempName = name;
    tempID = id;
    tempDesc = desc;
    tempPriority = priority;
    root.render(<App />)
}

function getData(callback) {
    if (filter == "") {
        let req = new XMLHttpRequest();
        //req.open("GET", `http://localhost:8080/getItemsByCount?count=${count}`, true);
        req.open("GET", `http://localhost:8080/getItems`, true);
        req.setRequestHeader("User-Id", parseInt(window.sessionStorage.getItem("user-id")));
        req.onload = function() {
            callback(req.responseText);
        }
        req.send();
    } else {
        let req = new XMLHttpRequest();
        //req.open("GET", `http://localhost:8080/getItems?count=${count}&rawName=${filter}`, true);
        req.open("GET", `http://localhost:8080/getItems?rawName=${filter}`, true);
        req.setRequestHeader("User-Id", parseInt(window.sessionStorage.getItem("user-id")));
        req.onload = function() {
            callback(req.responseText);
        }
        req.send()
    }
}

export default App;