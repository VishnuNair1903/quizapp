import React from 'react'
import { useDrag } from 'react-dnd'

function DragItem({id, text, innerRef}) {
    const [{isDragging}, drag] = useDrag(()=>({

        type:'ANSWER',
        item:{id},
        collect:(monitor)=>({
            isDragging:!!monitor.isDragging(),
        }),

    }),[id]);



  return (
    <div ref={(item)=>{
        drag(item);
        if(innerRef){
            innerRef(item);
        }

    }} style={{
        opacity:isDragging?0.5:1,
        padding:'5px',
        margin:'2px',
        backgroundColor:'black',
        color:'white',
        cursor:'move',
    }}>
        {text}
      
    </div>
  )
}

export default DragItem;
