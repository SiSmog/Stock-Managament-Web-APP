import * as React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { createTheme, TextField } from '@mui/material';
import { listArticle } from '../../Services/ArticleService';

import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';

import { visuallyHidden } from '@mui/utils';

import "./SelectedArticle.css"




function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'barcode',
    numeric: false,
    disablePadding: true,
    label: 'Barcode',
    align: "left",
    icon: false
  },
  {
    id: 'name',
    numeric: true,
    disablePadding: false,
    label: 'Name',
    align: "left",
    icon: false
  },
  {
    id: "quant",
    numeric: false,
    disablePadding: false,
    label: 'Quantity',
    align: "left",
    icon: true

  },
  {
    id: "price",
    numeric: false,
    disablePadding: false,
    label: 'Unit Price (TND)',
    align: "left",
    icon: true
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              hideSortIcon={headCell.icon}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};



export default function SelectedArticle(props) {
  const handleChangeSelected = props.handleChangeSelected;
  const ChangeSelected = (selectedRows) => {
    handleChangeSelected(selectedRows)

  }
  const handleChangeSelectedInfo = props.handleChangeSelectedInfo;
  const ChangeSelectedInfo = (selectedRows) => {
    handleChangeSelectedInfo(selectedRows)
  }

  const handleChangePages=props.handleChangePage;
  const ChangePage=(selectedRows)=>{
    handleChangePages(selectedRows)
  }
  const handleChangeRowsPerPages=props.handleChangeRowsPerPage;
  const ChangeRowsPerPage=(selectedRows)=>{
    handleChangeRowsPerPages(selectedRows)
  }
  const handleChangeQuantity=props.handleChangeQuantity;
  const ChangeQuantity=(quant)=>{
    handleChangeQuantity(quant)
  }
  const handleChangePrice=props.handleChangePrice;
  const ChangePrice=(price)=>{
    handleChangePrice(price)
  }
  const handleChangeQuantityError=props.handleChangeQuantityError;
  const ChangeQuantityError=(quant)=>{
    handleChangeQuantityError(quant)
  }
  const handleChangePriceError=props.handleChangePriceError;
  const ChangePriceError=(price)=>{
    handleChangePriceError(price)
  }
  const Ticket=props.Ticket

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState(props.selected);
  const [page, setPage] = React.useState(props.page);
  const [rowsPerPage, setRowsPerPage] = React.useState(props.rowsPerPage);
  const [quantity, setquantity] = React.useState(props.quantity);
  const [unitprice, setunitprice] = React.useState(props.price);
  const [quantityError, setquantityError] = React.useState(props.quantityError);
  const [unitpriceError, setunitpriceError] = React.useState(props.priceError);
  const [selectedData, setselectedData] = React.useState([]);
  const [content, setcontent] = React.useState(props.selectedInfo);



  React.useEffect(() => {
    ChangeSelected(selected)
  }, [selected]);
  React.useEffect(() => {
    updateMaps()
    ChangeSelectedInfo(content)
  }, [content]);
  React.useEffect(() => {
    ChangePage(page)
  }, [page]);
  React.useEffect(() => {
    ChangeRowsPerPage(rowsPerPage)
  }, [rowsPerPage]);
  React.useEffect(() => {
    ChangeQuantity(quantity)
  }, [quantity]);
  React.useEffect(() => {
    ChangePrice(unitprice)
    }, [unitprice]);
  React.useEffect(() => {
    ChangeQuantityError(quantityError)
  }, [quantityError]);
  React.useEffect(() => {
    ChangePriceError(unitpriceError)
    }, [unitpriceError]);


    const updateMaps=()=>{
      let keys = Array.from( quantity.keys() );
      let quant=quantity
      let price=unitprice
      let quantError=quantityError
      let priceError=unitpriceError
      if(keys.length<selected.length){
        let difference = selected.filter(x => !keys.includes(x));
        quant.set(difference[0],"")
        price.set(difference[0],"")
        quantError.set(difference[0],false)
        priceError.set(difference[0],false)
        setquantity(quant)
        setunitprice(price)
        setquantityError(quantError)
        setunitpriceError(priceError)
      }
      if(keys.length>selected.length){
        let difference = keys.filter(x => !selected.includes(x));
        quant.delete(difference[0])
        price.delete(difference[0])
        quantError.delete(difference[0])
        priceError.delete(difference[0])
        setquantity(quant)
        setunitprice(price)
        setquantityError(quantError)
        setunitpriceError(priceError)
      }
      console.log(quant)
    }
  const handleRequestSort = (event, property) => {
    if (property != null) {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    }

  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = content.map((n) => n.barcode);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
    setcontent([])
  };

  const handleClick = (event, barcode, name, quant, price, index) => {
    const selectedIndex = selected.indexOf(barcode);
    let newSelected = [];
    let newSelectedData = []
    let newContent = []
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, barcode);
      newSelectedData = newSelectedData.concat(selectedData, { barcode: barcode, name: name, quantity: parseInt(quant[index]), unitprice: parseFloat(price[index]) });
      newContent = newContent.concat(content, { barcode: barcode, name: name, quantity: parseInt(quant[index]) });
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      newSelectedData = newSelectedData.concat(selectedData.slice(1));
      newContent = newContent.concat(content.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      newSelectedData = newSelectedData.concat(selectedData.slice(0, -1));
      newContent = newContent.concat(content.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
      newSelectedData = newSelectedData.concat(selectedData.slice(0, selectedIndex), selectedData.slice(selectedIndex + 1));
      newContent = newContent.concat(content.slice(0, selectedIndex), content.slice(selectedIndex + 1));


    }

    setSelected(newSelected);
    setselectedData(newSelectedData)
    setcontent(newContent)
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };
  const handleQuantityChange = (event, barcode, max) => {
    if(Ticket){
      if (/^[0-9]{0,8}$/.test(event.target.value)) {
        if((event.target.value)>max){
          setquantity(prev => new Map([...prev, [barcode,max]]))
        }else{
          setquantity(prev => new Map([...prev, [barcode,event.target.value]]))
        }
      }
    }else{
      if (/^[0-9]{0,8}$/.test(event.target.value)) {
        setquantity(prev => new Map([...prev, [barcode,event.target.value]]))
      }
    }
    
  }
  const handleSpan = (barcode, currentQuantity) => {
    setquantity(prev=> new Map([...prev,[barcode,currentQuantity.toString()]]))
  }
  const handlePriceChange = (event, barcode) => {
    if (/^[0-9]*(\.)?[0-9]{0,3}$/.test(event.target.value) && event.target.value.length < 11) {
      setunitprice(prev => new Map([...prev, [barcode,event.target.value]]))
      console.log(unitprice)
    }

  }


  const isSelected = (barcode) => selected.indexOf(barcode) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * - content.length) : 0;
  const theme = createTheme({
    components:{
      MuiTextField:{
        styleOverrides:{
          root:{
            height:'40px'
          }
        }
      }
    }
  })
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={content.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 500 }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >

            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={content.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(content, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.barcode);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.barcode}
                      selected={isItemSelected}

                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          onClick={(event) => handleClick(event, row.barcode, row.name, quantity, unitprice, index)}
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell

                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.barcode}
                      </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">
                        <div className='flexrow'>
                          <TextField size='small' sx={{ width: 100 }} error={quantityError.get(row.barcode)||false} value={quantity.get(row.barcode)||""} onChange={(event) => handleQuantityChange(event, row.barcode,row.quantity)} />
                          <span className='indication' onClick={() => handleSpan(row.barcode, row.quantity)}>({row.quantity})</span>
                        </div>
                      </TableCell>
                      <TableCell align="left"><TextField error={unitpriceError.get(row.barcode)||false} size='small' sx={{ width: 125 }} value={unitprice.get(row.barcode)||""} onChange={(event) => handlePriceChange(event, row.barcode)} /></TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

      </Paper>
    </Box>
  );
}