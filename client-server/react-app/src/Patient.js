import React, { useState } from 'react';
import axios from 'axios';

function Patient() {
    const [items, setItems] = useState([]);
    const [searchWord, setSearchWord] = useState('')
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [alergies, setAlergies] = useState('');
    const [perscriptions, setPerscriptions] = useState('');

    function clearList(){
        setItems([]);
    }

    function showList(){
        axios.get('http://localhost:8080/patient')
        .then( (response) => {
            // handle success
            var resData = response.data;
            setItems(resData.data);
            console.log(items);
        });
    }
    
    function fetchPatients(){
        axios.get('http://localhost:8080/patient')
        .then( (response) => {
            // handle success
            var resData = response.data;
            let data = JSON.stringify(resData);
            window.alert("Response recieved from server = " + data);
        });
    }
    function savePatient(){
        const value = {
            id: id,
            name: name,
            category: category,
            alergies: alergies,
            perscriptions: perscriptions
        };

        axios.post('http://localhost:8080/patient', value)
        .then( (response) => {
            // handle success
            var resData = response.data;
            let data = JSON.stringify(resData);
            window.alert("Response recieved from server = " + data);
        });
    }



    function deletePatient(){
        axios.delete(`http://localhost:8080/deletePatient/${id}`)
        .then( (response) => {
            // handle success
            var resData = response.data;
            let data = JSON.stringify(resData);
            window.alert("Response recieved from server = " + data);
        });
    }


    
    function updatePatient(){
        const value = {
            id: id,
            name: name,
            category: category,
            alergies: alergies,
            perscriptions: perscriptions
        };
        axios.put(`http://localhost:8080/updatePatient/${id}`, value)
        .then( (response) => {
            // handle success
            var resData = response.data;
            let data = JSON.stringify(resData);
            window.alert("Response recieved from server = " + data);
        });
    }


    return (
        <div>
            <input type="number" placeholder='id' value ={id} onChange ={e => setId(e.target.value) }/>
            <br/>
            <input type="text" placeholder='patientName' value ={name} onChange ={e => setName(e.target.value) }/>
            <br/>
            <input type="text" placeholder='category' value ={category} onChange ={e => setCategory(e.target.value) }/>
            <br/>
            <input type="text" placeholder='alergies' value ={alergies} onChange ={e => setAlergies(e.target.value) }/>
            <br/>
            <input type="text" placeholder='perscriptions' value ={perscriptions} onChange ={e => setPerscriptions(e.target.value) }/>
            <br/>            
            <button onClick={savePatient}>Save Patient Details</button>
            <br/>
            <button onClick={updatePatient}>Update Patient Details</button> 
            <br/>            
            <button onClick={deletePatient}>Delete Patient Details</button> 
            <br/>            
            <h3>Show Patients:</h3>
            <button onClick={fetchPatients}>Display Patients</button> 
            <h3>List Patients:</h3>
            <button onClick={showList}>List Patients</button> 
            <div>
            {items.filter((items)=> {
                if (searchWord === ""){
                    return items
                } else if 
                (items.category.toLowerCase().includes(searchWord.toLowerCase())){
                    return items
                } 
                    return false;
            }).map((item) => (
            <div>
                <li>
                    {item.id}, {""}
                    {item.name}, {""}
                    {item.category}, {""}
                    {item.alergies}, {""}
                    {item.perscriptions}, 
                </li>
            </div>
            ))}
            </div>
            <input type="text" placeholder="search" onChange={e => {setSearchWord(e.target.value)}}/>
            <button onClick={clearList}>Clear List</button> 
            
        </div>
    );

}

export default Patient;
