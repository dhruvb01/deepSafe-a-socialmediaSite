import React from 'react'

const Test = () => {

const fun=()=>{
  const result =new Promise((resolve,reject)=>{
  
  setTimeout(() => {
    resolve(5)
  }, 1000);
   
  }).then((val)=>console.log("jii"))
  console.log("hello")
  console.log(result)
}


  return (
    <div onClick={fun}>Test</div>
  )
}

export default Test