import React, { Component } from 'react'
import TextField from '@mui/material/TextField';
import { listBarcode } from '../../Services/ArticleService';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
export default class SearchBarcodeMui extends Component {
    constructor(props) {
        super(props)

        this.state = {
            options: []
        }
    }
    refresh = () => {
        listBarcode().then((res) => {
            var allLines = []
            for (let i = 0; i < res.data.data.length; i++) {
                let obj = res.data.data[i]
                allLines.push(obj)
            }
            this.setState({options:allLines})
 
        })
    }
    componentDidMount() {
        this.refresh()
    }
    render() {
        return (
            <Autocomplete
                id="filter-demo"
                options={this.state.options}
                getOptionLabel={(option) => option.barcode.toString()}
                filterOptions={createFilterOptions({
                    matchFrom: 'start',
                    trim: true
                })}
                sx={{ width: 250 }}
                renderInput={(params) => <TextField  color="warning" size='small' {...params} label="Barcode" focused />}
            />
        )
    }
}
