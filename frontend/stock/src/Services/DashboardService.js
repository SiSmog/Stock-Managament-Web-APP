import api from "../Api.js"

export var listDashboard=()=>{
    return  api.get('list-dashboard.json')
}