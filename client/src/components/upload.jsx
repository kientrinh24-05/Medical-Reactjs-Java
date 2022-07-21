import { Progress, Upload } from "antd";
import { useState } from "react";
import { useAttachmentActions } from "@/_actions";
import classnames from "classnames";
const UploadControl = ({
    onChange,
    folder,
    children,
    showPercent = false,
    className,
    onUploadSuccess,
    onUploadFail,
    onStartUpload,
    ...props
}) => {
    const [uploadPercent, setUploadPercent] = useState(-1);
    const attachmentActions = useAttachmentActions();

    const uploadProps = {
        name: "file",
        ...props,
        customRequest: async (options) => {
            const { onSuccess, onError, file, onProgress } = options;
            const fmData = new FormData();

            fmData.append("file", file);
            if (folder) fmData.append("folder", folder);
            try {
                if (onStartUpload) onStartUpload(file.name);
                var res = await attachmentActions.upload(
                    fmData,
                    {
                        onUploadProgress: (event) => {
                            const percent = Math.floor(
                                (event.loaded / event.total) * 100
                            );
                            setUploadPercent(percent);
                            onProgress({
                                percent: (event.loaded / event.total) * 100,
                            });
                        },
                    },
                    file.uid
                );

                console.log(res)
                setUploadPercent(100);
                setTimeout(() => setUploadPercent(-1), 500);
                if (onUploadSuccess) onUploadSuccess(res);
                return onSuccess(res.url);
            } catch (err) {
                if (onUploadFail) onUploadFail(err);
                console.log("Eroor: ", err);
                onError({ err });
            }
        },
    };

    const classNames = classnames("relative inline-block", className);

    return (
        <div className={classNames}>
            <Upload {...uploadProps}>
                {children}
                {showPercent && uploadPercent > 0 && (
                    <Progress
                        className="absolute top-1/2 left-2 right-2 -translate-y-1/2"
                        percent={uploadPercent}
                    />
                )}
            </Upload>
        </div>
    );
};
export default UploadControl;
