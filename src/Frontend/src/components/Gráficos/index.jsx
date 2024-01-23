import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from "../../store/actions/actionProduct";
import { useTitle } from '../../context/TitleContext';
import Chart from 'react-apexcharts';

export const Graphs = () => {
    const dispatch = useDispatch();
    const { loading, products, error } = useSelector((state) => state.product);
    const { setTitle } = useTitle();

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    useEffect(() => {
        setTitle('Dashboards');
    }, [setTitle]);

    if (!Array.isArray(products)) {
        return <div>Carregando dados...</div>;
    }

    const counts = products.reduce((acc, item) => {
        acc[item.cidade] = (acc[item.cidade] || 0) + 1;
        return acc;
    }, {});

    const categories = Object.keys(counts);
    const data = Object.values(counts);

    const totalSum = data.reduce((acc, currentValue) => acc + currentValue, 0);

    // Conta as ocorrências de cada 'ne_name'
    const neNameCounts = products.reduce((acc, item) => {
        acc[item.ne_name] = (acc[item.ne_name] || 0) + 1;
        return acc;
    }, {});

    // Calcula a proporção de cada 'ne_name'
    const pieData = Object.values(neNameCounts).map(count => (count / totalSum) * 100);
    const pieCategories = Object.keys(neNameCounts);

    const chartOptions = {
        chart: {
            type: 'bar'
        },
        xaxis: {
            categories: categories
        }
    };

    const series = [{
        name: 'Quantidade na Cidade',
        data: data
    }];

    const totalChartOptions = {
        chart: {
            type: 'bar'
        },
        xaxis: {
            categories: ['Total']
        }
    };

    const totalSeries = [{
        name: 'Total de Produtos',
        data: [totalSum]
    }];

    const pieChartOptions = {
        chart: {
            type: 'pie'
        },
        labels: pieCategories
    };

    const pieSeries = pieData;

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap:'5px'}}>
                <div style={{ width: '50%' }}>
                    <h2> Ativos por Cidade </h2>
                    <Chart options={chartOptions} series={series} type="bar" />
                </div>
                <div style={{ width: '50%' }}>
                    <h2> Soma total dos Ativos </h2>
                    <Chart options={totalChartOptions} series={totalSeries} type="bar" />
                </div>
            <div style={{ width: '50%'}}>
                <h2> Proporção de Produtos por NE Name </h2>
                <Chart options={pieChartOptions} series={pieSeries} type="pie" />
            </div>
            </div>
        </>
    );
};
