import React, { useState } from 'react'
import {Button} from 'antd';
import classnames from 'classnames';
export default function ButtonGroup({buttons,active,onChange,className,...props}) {
    return (
            <div {...props} role="group">
                {
                    buttons && buttons.map((item, index) => {
                        const classNames = classnames(
                            "border-0 h-14 px-6 rounded-none hover:bg-orange-400 hover:text-white transition duration-200",{
                            "rounded-l-2xl":index===0,
                            "rounded-r-2xl":index===buttons.length-1,
                            "bg-orange-400 text-white focus:bg-orange-400 focus:text-white":index===active,
                            "bg-slate-200 focus:bg-slate-200 focus:text-black":index!==active
                            }
                        )
                        const {text,...btnProps}= item;
                     return <Button
                            className={classNames }
                            key={index}
                            onClick={() => onChange(index)}
                            {...btnProps}
                        >
                            {item.text}
                        </Button>
                    })
                }
        </div>
    )
}

ButtonGroup.defaultProps = {
    buttons: [],
}