import React from 'react'
import { useDrop } from 'react-dnd'

function DropTarget({id, onDrop, children, innerRef}) {

    const [{isOver}, drop] = useDrop(()=>({
        accept:'ANSWER',
        drop:(item)=>onDrop(item.id, id),
        collect:(monitor)=>({
            isOver:!!monitor.isOver(),
        }),
    }),[id, onDrop]);


  return (
    <div ref={(item)=>{
        drop(item);
        if(innerRef){
            innerRef(item);
        }
    
    }} style={{
        padding:'8px',
        margin:'4px',
        backgroundColor:isOver?'lighblue':'blue',
        border:'2px solid black',
        minHeight:'50px',
    }}>
        {children}
      
    </div>
  )
}

export default DropTarget
