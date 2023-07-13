import React from "react";
import { useState } from "react";
import { createRoot } from 'react-dom/client';

let root = createRoot(document.getElementById("priorityRoot"))

const Stats = () => {
    const [speed, setSpeed] = useState("0.0s");

    const checkSpeed = (callback) => {
        let start;
        let end;
        let req = new XMLHttpRequest();
        req.open("GET", "http://localhost:8080/health")
        req.onload = function() {
            end = Date.now();
            setSpeed(((end - start) / 1000) + "s")
            callback(); 
        }
        start = Date.now();
        req.send();
    }

    return (
        <div className = "statsOverlap">
            <div className = "statsContainer">
                <h1>Stats</h1>
                <div>
                    <button onClick={() => checkSpeed(function() {
                        root.render(<Stats />)
                    })}>Speed Test</button>
                    <p>{speed}</p>
                </div>
            </div>
        </div>
    );
}

export default Stats;