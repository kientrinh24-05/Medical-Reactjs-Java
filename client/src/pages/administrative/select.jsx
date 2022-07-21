import DebounceSelect from "@/components/debounce-select";
import { useRoleActions } from "@/_actions";
import { useRecoilValue } from "recoil";
import { rolesAtom } from "@/_state";

const RoleSelect = ({ ...props }) => {
    const actions = useRoleActions();
    const roles = useRecoilValue(rolesAtom);
    return (
        <DebounceSelect
            options={roles.items}
            fieldNames={{ label: "name", value: "id" }}
            fetchOptions={actions.search}
            formater={(options) =>
                options.map((option) => ({
                    label: option.name,
                    value: option.id,
                }))
            }
            {...props}
        />
    );
};

export default RoleSelect;
