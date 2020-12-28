import React , { useState ,useEffect} from 'react'
import List from './List.js'
import Alert from './Alert.js'
const getLocalStorage=() =>{
  let list = localStorage.getItem('list')
  if(list){
    return JSON.parse(localStorage.getItem('list'))
  }else{
    return []
  }
}
function App() {
  const [list, setList] = useState(getLocalStorage())
  const [alert, setAlert] = useState({
      show:false,
       msg:'',
       type:''
    })
  const [name,setName] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name){
      //deal with alert 
      showAlert(true, 'danger', 'Please Enter text')
    }
    else if(name && isEditing){
      //edit
      setList(list.map((item)=>{
        if(item.id === editId){
          return {...item,title:name}
        }
        return item
      }))
      setName('')
      setIsEditing(false)
      setEditId(null)
      showAlert(true,'success', 'Values changed successfully')
    }else{
      showAlert(true, 'success', 'Item Added ..!')
      const newItem = { id: new Date().getTime().toString(), title: name };

      setList([...list, newItem]);
      setName('');
    }
  }
  const showAlert = ({show=false, msg='', type=''}) => {
    setAlert({show:show, type:msg})
  }
  const clearList = () => {
    setAlert(true, 'danger', 'Empty list')
    setList([]);
  }
  const removeItem = (id) =>{
    setAlert(true, 'danger', 'Item removed')
    setList(list.filter(item => item.id !== id))
  }
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditId(id);
    setName(specificItem.title);
  }
  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  })
  return (
    <section className="section-center">

    <form className="grocery-form" onSubmit={handleSubmit}>

      {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
      <h3>Grocery Bud</h3>

      <div className="form-control">
      <input type="text" value={name} className="grocery"
        onChange={(e)=> setName(e.target.value)}
          placeholder="eg. eggs"
        />
        <button className="submit-btn">{isEditing ? 'edit': 'submit'}</button>
      </div>

    </form>
    {list.length > 0 && (<div className="grocery-container">
        <List items={list} editItem={editItem} removeItem={removeItem} />
        <button className="clear-btn" onClick={clearList}>Clear Item</button>
      </div>)}
      
    </section>
  );
}

export default App;
