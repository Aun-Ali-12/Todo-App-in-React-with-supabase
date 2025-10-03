import { supabase } from "./config";
import { useEffect, useState } from 'react'
import "./app.css"
function SupaApp() {
    // console.log(supabase, "hello");
    const [formData, setFormData] = useState([])
    const [userInput, setUserInput] = useState("")
    const [editIndex, seteditIndex] = useState(null)

    //takes input
    const handleChange = (e) => {
        setUserInput(e.target.value)
    }

    //handle submit btn function
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (editIndex == null) {
            const { data, error } = await supabase
                .from('todo_list')
                .insert([{ user_input: userInput.trim() }])
                .select()
            if (error) {
                console.log(error.message);
            } else {
                console.log(data);
                // fetchData()
                setFormData((prev) => [...prev, ...data])
            }
        }
        else {
            const { data, error } = await supabase
                .from('todo_list')
                .update([{ user_input: userInput.trim() }])
                .eq('id', editIndex)
            if (error) {
                console.log(error.message);
                return
            } else {
                console.log(data.user_input);
            }
        }

        setUserInput("")
    }


    //Del the value:
    const handleDel = async (i) => {
        const { response, error } = await supabase
            .from('todo_list')
            .delete()
            .eq('id', i)
        if (error) {
            console.log(error.message);
        } else {
            // console.log(response[i]);
            setFormData((prev) => prev.filter(index => index !== i))
        }
    }
    //editing the value:
    const handleEdit = (value) => {
        setUserInput(value.user_input)
        seteditIndex(value.id)
        console.log(value);

    }

    // fetch data from DB
    const fetchData = async () => {
        const { data, error } = await supabase
            .from('todo_list')
            .select('*')
        if (error) {
            console.log(error.message);
        } else {
            setFormData(data)
        }
    }
    useEffect(() => {
        fetchData()
    }, [formData])
    return (
        <>
            <h1>To do list</h1>
            <form onSubmit={handleSubmit}>
                <input placeholder="Add your task" required type="text" name="" id="txt" onChange={handleChange} value={userInput} />

                {editIndex == null ?
                    <button type="submit">Add</button>
                    :
                    <button type="submit">Update</button>
                }

            </form>
            <ul>
                {
                    formData.map((value, index) => (
                        <li key={index}>{value.user_input} <div className="button"> <button onClick={() => { handleEdit(value) }}>Edit</button> <button onClick={() => { handleDel(value.id) }}>Del</button></div> </li>
                    ))
                }
            </ul>
        </>
    )
}
export default SupaApp