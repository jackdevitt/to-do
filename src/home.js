import React from "react";
import { useState } from "react";
import { createRoot } from "react-dom/client";

document.getElementById("header").style.display = "none";
const root = createRoot(document.getElementById("priorityRoot"));
let logIn = false;
let signUp = false;

let userId = 0;

function showSignUp() {
    signUp = true;
    root.render(<Home />);
}

function showLogIn() {
    logIn = true;
    root.render(<Home />);
}

const Home = () => {

    const [username, setName] = useState("")
    const [password, setPassword] = useState("")
    const [submitResponse, setSubmitResponse] = useState("")

    const [userField, setUserField] = useState("")
    const [passField, setPassField] = useState("")
    const [confirmField, setConfirmField] = useState("")

    const exitForm = () => {
        logIn = false;
        signUp = false;
        setName("")
        setPassword("")
        setSubmitResponse("")
        setUserField("")
        setPassField("")
        setConfirmField("")

        root.render(<Home />)
    }

    const logInCommand = (event) => {
        event.preventDefault();
        let req = new XMLHttpRequest();
        req.open("POST", "http://localhost:8080/validateUser");
        req.onload = function() {
            let response = JSON.parse(req.responseText);
            if (response["id"] != null) {
                userId = response["id"];
                setUserField("");
                setPassField("");
                setSubmitResponse("");
                setName("");
                setPassword("");
                
                window.sessionStorage.setItem("user-id", userId);
                window.location.href = `/app`;
            } else {
                setSubmitResponse("Username or password is incorrect");
                setUserField("");
                setPassField("");
            }
        }
        req.send(JSON.stringify({"username": username, "password": password}));
    }

    const signUpCommand = (event) => {
        event.preventDefault();
        if (password != confirmField) {
            setUserField("");
            setPassField("");
            setName("");
            setPassword("");
            setConfirmField("");
            setSubmitResponse("Password and confirmation do not match")
        } else {

            let req = new XMLHttpRequest();
            req.open("POST", "http://localhost:8080/addUser");
            req.onload = function() {
                setUserField("");
                setPassField("");
                setName("");
                setPassword("");
                setConfirmField("");
                if (req.status == 200) {
                    let response = JSON.parse(req.responseText);
                    let userId = response["id"];
                    setSubmitResponse("");
                    window.sessionStorage.setItem("user-id", userId);
                    window.location.href = `/app`;
                } else if (req.status == 409) {
                    setSubmitResponse("Username already taken");
                } else {
                    setSubmitResponse("Something went wrong");
                }
            }
            req.send(JSON.stringify({"username": username, "password": password}))
        }
    }

    document.getElementById("header").style.display = "none";
    document.body.style.overflow = "hidden";
    if (logIn) {
        return (
            <div className = "formContainer">
                <div className = "form">
                    <button className = "exitForm" onClick={() => exitForm()}><img src = "back.png" width = "50px" height = "50px"/></button>
                    <form className = "editForm" onSubmit = {logInCommand}>
                        <h1 className = "title">Log-In</h1>
                        <br />
                        <br />
                        <br />
                        <label className = "label">
                            Username
                            <br />
                            <input placeholder = "username" value = {userField} className = "input-text" type = "text" onChange={function(event) {setUserField(event.target.value); setName(event.target.value.toString())}}></input>
                        </label>
                        <br />
                        <br />
                        <label className = "label">
                            Password
                            <br />
                            <input placeholder = "password" value = {passField} className = "input-text" type = "password" onChange={function(event) {setPassField(event.target.value); setPassword(event.target.value.toString())}}></input>
                        </label>
                        <p className = "error">{submitResponse}</p>
                        <br />  
                        <br />
                        <br />
                        <input type = "submit" className = "input-submit"></input>
                    </form>
                </div>
            </div>
        );
    } else if (signUp) {
        return (
            <div className = "formContainer">
                <div className = "form">
                <button className = "exitForm" onClick={() => exitForm()}><img src = "back.png" width = "50px" height = "50px"/></button>
                    <form className = "editForm" onSubmit = {signUpCommand}>
                        <h1 className = "title">Sign up</h1>
                        <br />
                        <br />
                        <br />
                        <label className = "label">
                            Username
                            <br />
                            <input placeholder = "username" value = {userField} className = "input-text" type = "text" onChange={function(event) {setUserField(event.target.value); setName(event.target.value.toString())}}></input>
                        </label>
                        <br />
                        <br />
                        <label className = "label">
                            Password
                            <br />
                            <input placeholder = "password" value = {passField} className = "input-text" type = "password" onChange={function(event) {setPassField(event.target.value); setPassword(event.target.value.toString())}}></input>
                        </label>
                        <br />
                        <br />
                        <label className = "label">
                            Confirm Password
                            <br />
                            <input placeholder = "confirm password" value = {confirmField} className = "input-text" type = "password" onChange={function(event) {setConfirmField(event.target.value)}}></input>
                        </label>
                        <p className = "error">{submitResponse}</p>
                        <br />  
                        <input type = "submit" className = "input-submit"></input>
                    </form>
                </div>
            </div>
        );
    } else {
        return (
            <div className = "MainContainer">
                <h1 className = "Main">To-Do</h1>
                <p className = "subtext">Changing the world one task at a time</p>
                <div id = "buttons">
                    <button className = "homeButton" onClick = {() => showLogIn()}>Log in</button>
                    <button className = "homeButton" onClick = {() => showSignUp()}>Sign up</button>
                </div>
            </div>
        )
    }
}

export default Home;