import {useState} from "react";
function HabitForm({onAddHabit}){
    const [name, setName]= useState("");
    const[time, setTime]= useState("morning");
    const[error, setError]= useState("");

    function handleSubmit(event){
        event.preventDefault();

        const cleanedName= name.trim();

    if (!cleanedName){
        setError("Habit name is required.");
        return;
    }
    onAddHabit({
        name: cleanedName, 
        time: time,
    });
    setError("");
    setName("");
    setTime("morning");
    }
    return(
        <form onSubmit = {handleSubmit}>
            <h3>Add New Habit</h3>
            <input 
                type="text"
                placeholder="Enter habit name"
                value={name}
                onChange={(event)=>setName(event.target.value)}
                />
                <select
                value={time}
                onChnage={(event)=> setTime(event.target.value)}
                >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="night">Night</option>
                </select>

                <button type="submit">Add Habit</button>
                {error && <p>{error}</p>}
        </form>
    );
}
export default HabitForm;