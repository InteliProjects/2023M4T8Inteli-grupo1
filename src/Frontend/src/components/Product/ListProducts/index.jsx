import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from "../../../store/actions/actionProduct";
import './ListProducts.css';
import { formatDate } from '../../../utils/formatDate';
import { useTitle } from '../../../context/TitleContext';
import { useNavigate } from 'react-router-dom';


export const ListProducts = () => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 10;
    const { setTitle } = useTitle();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    useEffect(() => {
        setTitle('Lista de Ativos');
    }, [setTitle]);



    const { loading, products, error } = useSelector((state) => state.product);

    const totalPages = products ? Math.ceil(products.length / itemsPerPage) : 0;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    const currentItems = products && products
        .filter(product => product.board_full_name.toLowerCase().includes(searchTerm))
        
        .slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const isDisabled = (direction) => {
        return direction === 'prev' ? currentPage === 1 : currentPage === totalPages;
    };

    if (!products || products.length === 0) {
        return <div className="empty">No products found</div>;
    }

    const handleItemClick = (productId) => {
        navigate(`/dash/${productId}`);
    };

    const handleNewProductClick = () => {
        navigate('/dash/product/new');
    };

    return (
        <>
        <div className="search-bar-container">
            <input
            type="text"
            placeholder="Qual produto você procura?"
            className="search-bar"
            onChange={handleSearchChange}
            />
            <button className='newProduct' onClick={handleNewProductClick}>Adicionar Ativo</button>
        </div>
        <div className='list-container'>
            {currentItems && currentItems.map((product) => (
            <div key={product._id} className='list-item' onClick={() => handleItemClick(product._id)}>
                <h3>{product.board_full_name}</h3>
                <p>{formatDate(product.inicio_contrato) + ' - ' + formatDate(product.fim_contrato)}</p>
                <p>{product.description + ' - ' + product.ne_adress + ', ' + product.uf + ' - ' + product.fim_garantia}</p>
            </div>
            ))}
        </div>

        <div className='pagination'>
        <button onClick={() => paginate(1)} disabled={isDisabled('prev')}>
            {'<<'}
        </button>
        <button onClick={() => paginate(currentPage - 1)} disabled={isDisabled('prev')}>
            {'<'}
        </button>

        {/* Show current page */}
        <button
            onClick={() => paginate(currentPage)}
            className={`page-item ${'current-page'}`}
        >
            {currentPage}
        </button>

        {/* Show next two pages if they exist */}
        {[...Array(totalPages).keys()]
            .filter(number => number > currentPage - 1 && number < currentPage + 2)
            .map(number => (
            <button
                key={number}
                onClick={() => paginate(number + 1)}
                className='page-item'
            >
                {number + 1}
            </button>
        ))}

        {/* Show ellipsis if there are more pages before the last page */}
        {currentPage + 2 < totalPages && (
            <span> ... </span>
        )}

        {/* Show the last page */}
        {currentPage !== totalPages && (
            <button
            onClick={() => paginate(totalPages)}
            className='page-item'
            >
            {totalPages}
            </button>
        )}

        <button onClick={() => paginate(currentPage + 1)} disabled={isDisabled('next')}>
            {'>'}
        </button>
        <button onClick={() => paginate(totalPages)} disabled={isDisabled('next')}>
            {'>>'}
        </button>
        </div>


        {loading && <div className="loading">Loading...</div>}
        {/* {error && <div className="error">Error: {error.message}</div>} */}
    </>
  );
}
