import React from 'react';
import './css/TableHeaderStyle.css';

const TableHeader = (props) => {
    return (
        <div className="pages-header">
            <h1 className="pages-title">{props.name}</h1>
            <div className="pages-selects-container">
                {props.workshopList &&
                    <div className='pages-input-select-field-container'>
                    <select
                        className='pages-input-select-field'
                        onChange={props.handleWorkshopChange}
                        placeholder="Sélectionnez un atelier"
                    >
                        <option value={''}>Sélectionnez un atelier</option>
                        {props.workshopList?.map((option, index) => (
                            <option key={index} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                    </div>
                }
                {props.FamilyList &&
                    <div className='pages-input-select-field-container'>
                    <select
                        className='pages-input-select-field'
                        onChange={props.handleFamilyChange}
                        placeholder="Sélectionnez un atelier"
                    >
                        <option value={''}>Sélectionnez une famille</option>
                        {props.FamilyList?.map((option, index) => (
                            <option key={index} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                    </div>
                }
                {props.ZoneList && import.meta.env.VITE_MANAGER_TYPE == props.type &&
                    <div className='pages-input-select-field-container'>
                    <select
                        className='pages-input-select-field'
                        onChange={props.handleZoneChange}
                        placeholder="Sélectionnez un atelier"
                    >
                        <option value={''}>Sélectionnez une zone</option>
                        {props.ZoneList?.map((option, index) => (
                            <option key={index} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                    </div>
                }
                {(
                    import.meta.env.VITE_MANAGER_TYPE == props.type && props.name == 'Liste des produits'
                 ) &&
                    <button className='pages-buttonfield' onClick={props.handleClickOpen}>Ajouter un produit</button>
                }    
                {
                (
                    import.meta.env.VITE_AGENT_TYPE == props.type && props.name == 'Liste des pannes'
                 ) &&
                    <button className='pages-buttonfield' onClick={props.handleClickOpen}>Ajouter une panne</button>
                }
                {
                (
                    import.meta.env.VITE_MANAGER_TYPE == props.type && props.name == 'Liste des zonnes'
                 ) &&
                    <button className='pages-buttonfield' onClick={props.handleClickOpen}>Ajouter une zone</button>
                }   
                {
                (
                    import.meta.env.VITE_MANAGER_TYPE == props.type && props.name == 'Liste des ateliers'
                 ) &&
                    <button className='pages-buttonfield' onClick={props.handleClickOpen}>Ajouter un atelier</button>
                }  
                {
                (
                    import.meta.env.VITE_MANAGER_TYPE == props.type && props.name == 'Liste des actions'
                 ) &&
                    <button className='pages-buttonfield' onClick={props.handleClickOpen}>Ajouter une action</button>
                }  
                {
                (
                    import.meta.env.VITE_MANAGER_TYPE == props.type && props.name == 'Liste des pieces'
                 ) &&
                    <button className='pages-buttonfield' onClick={props.handleClickOpen}>Ajouter une piece</button>
                }  
                {
                (
                    import.meta.env.VITE_MANAGER_TYPE == props.type && props.name == 'Liste des utilisateurs'
                 ) &&
                    <button className='pages-buttonfield' onClick={props.handleClickOpen}>Ajouter un utilisateur</button>
                }                           
            </div>
        </div>
    );
}
export default TableHeader;
