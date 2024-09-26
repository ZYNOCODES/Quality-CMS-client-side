import React from 'react';
import './css/TableHeaderStyle.css';

const TableHeader = (props) => {
    return (
        <div className="pages-header">
            <h1 className="pages-title">{props.name}</h1>
            <div className="pages-selects-container">
                {/* select fields */}
                {props.PanneTypeList && props.handlePanneTypeChange &&
                    <div className='pages-input-select-field-container'>
                    <select
                        className='pages-input-select-field'
                        onChange={props.handlePanneTypeChange}
                        placeholder="Sélectionnez un atelier"
                    >
                        <option value={''}>Sélectionnez un type de panne</option>
                        {props.PanneTypeList?.map((option, index) => (
                            <option key={index} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                    </div>
                }
                {props.workshopList && props.handleWorkshopChange &&
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
                {props.FamilyList && props.handleFamilyChange &&
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
                {props.LotList && props.handleLotChange &&
                    <div className='pages-input-select-field-container'>
                    <select
                        className='pages-input-select-field'
                        onChange={props.handleLotChange}
                        placeholder="Sélectionnez un lot"
                    >
                        <option value={''}>Sélectionnez un lot</option>
                        {props.LotList?.map((option, index) => (
                            <option key={index} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                    </div>
                }
                {props.ArrivalList && props.handleArrivalChange &&
                    <div className='pages-input-select-field-container'>
                    <select
                        className='pages-input-select-field'
                        onChange={props.handleArrivalChange}
                        placeholder="Sélectionnez un atelier"
                    >
                        <option value={''}>Sélectionnez un arrivage</option>
                        {props.ArrivalList?.map((option, index) => (
                            <option key={index} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                    </div>
                }
                {props.ZoneList && props.handleZoneChange && import.meta.env.VITE_MANAGER_TYPE == props.type &&
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

                {/* buttons */}
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
                    import.meta.env.VITE_MANAGER_TYPE == props.type && props.name == 'Liste des types de panne'
                 ) &&
                    <button className='pages-buttonfield' onClick={props.handleClickOpen}>Ajouter un type de panne</button>
                }  
                {
                (
                    import.meta.env.VITE_MANAGER_TYPE == props.type && props.name == 'Liste des agents'
                 ) &&
                    <button className='pages-buttonfield' onClick={props.handleClickOpen}>Ajouter un agent</button>
                } 
                {
                (
                    import.meta.env.VITE_MANAGER_TYPE == props.type && props.name == 'Liste des techniciens'
                 ) &&
                    <button className='pages-buttonfield' onClick={props.handleClickOpen}>Ajouter un technicien</button>
                }  
                {
                (
                    import.meta.env.VITE_MANAGER_TYPE == props.type && props.name == 'Liste des displayers'
                 ) &&
                    <button className='pages-buttonfield' onClick={props.handleClickOpen}>Ajouter un displayer</button>
                } 
                {
                (
                    import.meta.env.VITE_MANAGER_TYPE == props.type && props.name == 'Liste des familles'
                 ) &&
                    <button className='pages-buttonfield' onClick={props.handleClickOpen}>Ajouter une famille</button>
                }     
                {
                (
                    import.meta.env.VITE_MANAGER_TYPE == props.type && props.name == 'Liste des lots'
                 ) &&
                    <button className='pages-buttonfield' onClick={props.handleClickOpen}>Ajouter un lot</button>
                }        
                {
                (
                    import.meta.env.VITE_AGENT_TYPE == props.type && props.name == 'Liste des pannes non restituées'
                 ) &&
                    <button className='pages-buttonfield' onClick={props.handleOpenConfirmationDialog}>Restitution</button>
                }  
                {
                (
                    import.meta.env.VITE_MANAGER_TYPE == props.type && props.name == 'Liste des arrivages'
                 ) &&
                    <button className='pages-buttonfield' onClick={props.handleClickOpen}>Ajouter un arrivage</button>
                }                    
                {
                (
                    import.meta.env.VITE_MANAGER_TYPE == props.type && props.name == 'Liste des fournisseurs'
                 ) &&
                    <button className='pages-buttonfield' onClick={props.handleClickOpen}>Ajouter un fournisseur</button>
                }    
            </div>
        </div>
    );
}
export default TableHeader;
