const setDateFormat=(date,variant=false)=>{
    if(variant){
        return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()
    }
    else{
        return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"T"+"00:00:00"+"+00:00"
    }
}
export default setDateFormat