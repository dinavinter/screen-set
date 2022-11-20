import React  from "react";
import ReactJson from 'react-json-view';

// const ReactJson = await import(`react-json-view`)

export interface JsonProps {data:any};

 
export const JsonView:React.FC<JsonProps>= ({data}) => {
 
    if (!data || !(data instanceof Object)) {
        return( <span>`{data || 'no information'}`</span>);
    }
    return (
        <div>
            <ReactJson collapsed={false} theme={"bright:inverted"} src={data}/>
            {/*{window && <JSONTree data={data} theme="bright" shouldExpandNode={shouldExpandNode} />}*/}
        </div>
    );
}


export default JsonView;
  
  
