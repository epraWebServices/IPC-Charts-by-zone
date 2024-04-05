import React, {useState, useEffect} from 'react';
import { PublicationsService } from '../service/PublicationsService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from "primereact/multiselect";
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
/*
import { FilterService } from "primereact/api";

const myFilter = (filter, value) => {
    if (filter === undefined || filter === null || filter.length === 0) {
        return true;
    }
    //value.some(v => x.includes(v))
    //x.every(v => value.includes(v))
    return value.some(v => filter.includes(v))
};

FilterService.register("myfilter", myFilter);
*/

const Publications = () => {
    const publicationsService = new PublicationsService()
    const [values,setValues] = useState(null);
    const [loading,setLoading] = useState(false);
    const [expandedRows, setExpandedRows] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);

    const categories = [
        { name: "category1"},
        { name: "category2"},
        { name: "category3"},
      ];
    const execute = async() => {
        const res = await publicationsService.getAll()
        if (res.success){
            let x = res.object
            x.map((data) =>{
                
                let y = data.category.split(";")
                data.category = []
                for (let i = 0; i<y.length; i++){
                    data.category.push(y[i])
                }
            })
            setValues(x)
            setLoading(false)
        }
    }
    useEffect(() => {
        setLoading(true);
        execute()
    },[])

    const rowExpansionTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h5>Description:</h5>
                <p style={{textAlign:"justify", textJustify:"inter-word", fontSize:"15px"}}>
                    {data.description}
                </p>
                <h5>Cite:</h5>
                <p style={{textAlign:"justify", textJustify:"inter-word", fontSize:"15px"}}>
                    {data.cite}
                </p>
            </div>
        );
    }
    const allowExpansion = () => {
        return true;
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Publications</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    
    const categoryFilterTemplate = (options) => {
        return (
            <MultiSelect
                value={options.value}
                options={categories}
                itemTemplate={categoryItemTemplate}
                onChange={(e) => options.filterCallback(e.value)}
                optionLabel="name"
                placeholder="Select Keywords"
            />          
        );
      };
    
    const categoryItemTemplate = (option) => {
    return (
        <div className="p-multiselect-representative-option">
        <span className="image-text">{option.name}</span>
        </div>
    );
    };

    const categoryBodyTemplate = (rowData) => {
        const category = rowData.category;
        return (
          <React.Fragment>
            {category.map(data=>{
                return(
                    <Tag className="mr-2" severity="success" value={data}></Tag>
                )
            })}
          </React.Fragment>
        );
      };
    
    function customFunction(value, filter){

        if (filter === undefined || filter === null || filter.length === 0) {
            return true;
        }
        let x = []
        filter.map((data)=>{x.push(data.name)})
        
        //value.some(v => x.includes(v))
        //x.every(v => value.includes(v))
        return value.some(v => x.includes(v))
 
    }
    return(
        <div>
            <div className="card">
            <DataTable header={header} value={values} responsiveLayout="scroll"
            loading={loading}
            sortField="id" sortOrder={1}
            dataKey="id"
            expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={rowExpansionTemplate}
            globalFilter={globalFilter}
            >
                <Column expander={allowExpansion} style={{ width: '3em' }}/>
                <Column field="publication" header="Publication"></Column>
                <Column field="authors" header="Authors" filter filterPlaceholder="Filter by Author" filterMatchMode="contains"></Column>
                <Column field="category" header="Keywords" filter filterField="category" body={categoryBodyTemplate} showFilterMenuOptions= {false} showAddButton={false} showFilterMatchModes={false} filterElement={categoryFilterTemplate} filterMatchMode="custom" filterFunction={customFunction} filterMenuStyle={{ width: "16rem" }} style={{ maxWidth: "16rem" }}></Column>      
                <Column field="publication_date" header="Publication Date"></Column>
                <Column field="publisher" header="Publisher"></Column>
                <Column field="journal" header="Journal"></Column> 
                <Column field="volume" header="Volume"></Column> 
                <Column field="issue" header="Issue"></Column> 
                <Column field="pages" header="Pages"></Column>       
                <Column exportable={false} ></Column>
            </DataTable>
            </div>
        </div>
    )
}
export default Publications