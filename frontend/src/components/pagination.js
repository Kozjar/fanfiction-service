import React from 'react'
import PropTypes from 'prop-types'
import Pagination from 'react-bootstrap/Pagination'

const DefaultPagination = props => {
  function changePage(e) {
    if (e.target.tagName === 'A') {
      props.handleChangePage(e.target.getAttribute('topage'));
    }
  }
  return (
    <Pagination onClick={e => changePage(e)}>
        <Pagination.Prev disabled={props.page === 1} topage={props.page - 1}/>
        {
        props.page > 3 && 
          <>
            <Pagination.Item topage={1}>{1}</Pagination.Item>
            <Pagination.Ellipsis disabled />
          </>
        }

        {props.page > 2 && <Pagination.Item topage={props.page - 2}>{props.page - 2}</Pagination.Item>}
        {props.page > 1 && <Pagination.Item topage={props.page - 1}>{props.page - 1}</Pagination.Item>}

        <Pagination.Item active>{props.page}</Pagination.Item>

        {props.page <= props.totalPages - 1 && 
          <Pagination.Item topage={props.page + 1}>{props.page + 1}</Pagination.Item>}
        {props.page <= props.totalPages - 2 && 
          <Pagination.Item topage={props.page + 2}>{props.page + 2}</Pagination.Item>}

        {
        props.page <= props.totalPages - 3 && 
          <>
            <Pagination.Ellipsis disabled />
            <Pagination.Item topage={props.totalPages}>{props.totalPages}</Pagination.Item>
          </>
        }
        <Pagination.Next disabled={props.page === props.totalPages} topage={props.page + 1}/>
    </Pagination>
  )
}

DefaultPagination.propTypes = {
  page: PropTypes.number,
  totalPages: PropTypes.number,
  handleChangePage: PropTypes.func
}

export default DefaultPagination
