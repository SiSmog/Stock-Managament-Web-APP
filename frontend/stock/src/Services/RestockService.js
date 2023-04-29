import api from "../Api.js"

export var listRestock=async(params='')=>{
    return await api.get('list-restock.json'+params)
}
export const addRestock=(req)=>{
    return api.post('add-restock.json',req)
}
export const updateRestock=(req,restockid)=>{
    return api.put('update-restock/'+restockid+'.json',req)
}
export const deleteRestock=(restockid)=>{
    return api.delete('delete-restock/many/'+restockid+'.json')
}
