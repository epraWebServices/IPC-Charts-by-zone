import { Dialog } from "primereact/dialog";
import React, {useEffect, useCallback, useMemo, useState, useRef} from "react";

const SubstationDialog = (props) => {
    const [visible, setVisible] = useState(false)
    const [dialogContent, SetDialogContent] = useState()
    function HideDialog(){
        setVisible(false)
        SetDialogContent('')
    }

    return(
        <div>
            <Dialog header="aa" style={{width: '20vw'}} visible={visible} modal onHide={HideDialog}>{dialogContent}</Dialog>
        </div>
    )
}

export default SubstationDialog