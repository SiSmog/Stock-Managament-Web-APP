import api from "../Api.js"

export var listTicket=async(params='')=>{
    return await api.get('list-ticket.json'+params)
}
export const addTicket=(req)=>{
    return api.post('add-ticket.json',req)
}
export const updateTicket=(req,ticketid)=>{
    return api.put('update-ticket/'+ticketid+'.json',req)
}
export const deleteTicket=(ticketid)=>{
    return api.delete('delete-ticket/many/'+ticketid+'.json')
}
