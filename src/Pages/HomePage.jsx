import './css/HomePageStyle.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { useState } from 'react';

const HomePage = () => {
    const [ data, setData ] = useState([
        {
            EnAttente: 59,
            EnReparation: 57,
            Repare: 86,
            month: 'Jan',
          },
          {
            EnAttente: 50,
            EnReparation: 52,
            Repare: 78,
            month: 'Feb',
          },
          {
            EnAttente: 47,
            EnReparation: 53,
            Repare: 106,
            month: 'Mar',
          },
          {
            EnAttente: 54,
            EnReparation: 56,
            Repare: 92,
            month: 'Apr',
          },
          {
            EnAttente: 57,
            EnReparation: 69,
            Repare: 92,
            month: 'May',
          },
          {
            EnAttente: 60,
            EnReparation: 63,
            Repare: 103,
            month: 'June',
          },
          {
            EnAttente: 59,
            EnReparation: 60,
            Repare: 105,
            month: 'July',
          },
          {
            EnAttente: 65,
            EnReparation: 60,
            Repare: 106,
            month: 'Aug',
          },
          {
            EnAttente: 51,
            EnReparation: 51,
            Repare: 95,
            month: 'Sept',
          },
          {
            EnAttente: 60,
            EnReparation: 65,
            Repare: 97,
            month: 'Oct',
          },
          {
            EnAttente: 67,
            EnReparation: 64,
            Repare: 76,
            month: 'Nov',
          },
          {
            EnAttente: 61,
            EnReparation: 70,
            Repare: 103,
            month: 'Dec',
          },
    ]);
    const chartSetting = {
        yAxis: [
          {
            label: '',
          },
        ],
        sx: {
          [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(-20px, 0)',
          },
        },
    };
      
    const valueFormatter = (value) => `${value}mm`;
      
    return (
        <div className="dashboar-container">
            <div className="nav-bar-dashboard-conainer">
                <div className="nav-bar-dashboard-card">
                    <h1>Start</h1>
                </div>
                <div className="nav-bar-dashboard-card">
                    <h1>End</h1>
                </div>
            </div>
            <div className="top-bar-dashboard-container">
                <div className="top-bar-dashboard-card">
                    <h1>En attente</h1>
                    <p>200</p>
                </div>
                <div className="top-bar-dashboard-card">
                    <h1>En réparation</h1>
                    <p>45</p>
                </div>
                <div className="top-bar-dashboard-card">
                    <h1>Réparé</h1>
                    <p>309</p>
                </div>
            </div>
            <div className="middle-bar-dashboard-container">
                <div className="middle-bar-dashboard-card">
                    <h1>Nombre de panne</h1>
                    <BarChart
                        dataset={data}
                        xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                        series={[
                            { dataKey: 'EnAttente', label: 'En attente', valueFormatter },
                            { dataKey: 'EnReparation', label: 'En réparation', valueFormatter },
                            { dataKey: 'Repare', label: 'Réparé', valueFormatter },
                        ]}
                        {...chartSetting}
                    />
                </div>
                <div className="middle-bar-dashboard-card">
                    <h1>Top technician</h1>
                    <div className="dashboard-view-card-item">
                        <h1>Technician 1</h1>
                        <VisibilityIcon className='dashboard-view-card-item-icon' />
                    </div>
                    <div className="dashboard-view-card-item">
                        <h1>Technician 1</h1>
                        <VisibilityIcon className='dashboard-view-card-item-icon' />
                    </div>
                    <div className="dashboard-view-card-item">
                        <h1>Technician 1</h1>
                        <VisibilityIcon className='dashboard-view-card-item-icon' />
                    </div>
                    <div className="dashboard-view-card-item">
                        <h1>Technician 1</h1>
                        <VisibilityIcon className='dashboard-view-card-item-icon' />
                    </div>
                    <div className="dashboard-view-card-item">
                        <h1>Technician 1</h1>
                        <VisibilityIcon className='dashboard-view-card-item-icon' />
                    </div>
                    
                </div>
            </div>
            <div className="bottom-bar-dashboard-container">
                <div className="bottom-bar-dashboard-card">
                    <h1>Top pannes</h1>
                    <div className="dashboard-view-card-item">
                        <h1>Panne 1</h1>
                        <VisibilityIcon className='dashboard-view-card-item-icon' />
                    </div>
                    <div className="dashboard-view-card-item">
                        <h1>Panne 1</h1>
                        <VisibilityIcon className='dashboard-view-card-item-icon' />
                    </div>
                    <div className="dashboard-view-card-item">
                        <h1>Panne 1</h1>
                        <VisibilityIcon className='dashboard-view-card-item-icon' />
                    </div>
                    <div className="dashboard-view-card-item">
                        <h1>Panne 1</h1>
                        <VisibilityIcon className='dashboard-view-card-item-icon' />
                    </div>
                </div>
                <div className="bottom-bar-dashboard-card">
                    <h1>Top action corrective</h1>
                    <div className="dashboard-view-card-item">
                        <h1>Action corrective 1</h1>
                    </div>
                    <div className="dashboard-view-card-item">
                        <h1>Action corrective 1</h1>
                    </div>
                    <div className="dashboard-view-card-item">
                        <h1>Action corrective 1</h1>
                    </div>
                    <div className="dashboard-view-card-item">
                        <h1>Action corrective 1</h1>
                    </div>
                </div>
                <div className="bottom-bar-dashboard-card">
                    <h1>Top PDR consommé</h1>
                    <div className="dashboard-view-card-item">
                        <h1>PDR consommé 1</h1>
                    </div>
                    <div className="dashboard-view-card-item">
                        <h1>PDR consommé 1</h1>
                    </div>
                    <div className="dashboard-view-card-item">
                        <h1>PDR consommé 1</h1>
                    </div>
                    <div className="dashboard-view-card-item">
                        <h1>PDR consommé 1</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default HomePage;