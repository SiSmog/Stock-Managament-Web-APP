import api from "../Api.js"

export var listArticle=(params = '')=>{
    return  api.get('list-article.json'+params)
}
export var listBarcode=()=>{
    return  api.get('list-article/barcode.json')
}
export var listArticleById=(id)=>{
    return  api.get('list-article/'+id+'.json')
}
export const addArticle=(req)=>{
    return api({
        method: "post",
        url: "https://app1.mtdcrm.tn/api/add-article.json",
        data: req,
        headers: { "Content-Type": "multipart/form-data" },
      })
}
export const updateArticle=(req,barcode)=>{
    return api({
        method: "post",
        url: "https://app1.mtdcrm.tn/api/update-article/"+barcode+".json",
        data: req,
        headers: { "Content-Type": "multipart/form-data" },
      })
}
export const deleteArticle=(barcode)=>{
    return api.delete('delete-article/'+barcode+'.json')
}
