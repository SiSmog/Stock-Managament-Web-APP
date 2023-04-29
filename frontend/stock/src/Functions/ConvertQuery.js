const ConvertQuery=(query,res)=>{
    return "?"+query.toString().slice(query.toString().length-res.length+1)
}
export default ConvertQuery