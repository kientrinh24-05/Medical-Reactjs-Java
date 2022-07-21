import { Select, Spin } from "antd";
import { useState, useMemo, useRef, useEffect } from "react";
import { debounce } from "lodash";
const DebounceSelect = ({
    fetchOptions,
    debounceTimeout = 800,
    filter: propFilter,
    options: propOptions,
    ...props
}) => {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState(propOptions || []);
    const [filter, setFilter] = useState({
        page: 1,
        search: null,
    });
    const fetchRef = useRef(0);

    let source = axios.CancelToken.source();

    const onScroll = (event) => {
        var target = event.target;
        if (
            !fetching &&
            target.scrollTop + target.offsetHeight === target.scrollHeight
        ) {
            target.scrollTo(0, target.scrollHeight);
            setFilter({
                ...filter,
                page: filter.page + 1,
            });
        }
    };

    useEffect(() => {
        debounceLoadData();
        return () => source.cancel("Cancelling in cleanup");
    }, [filter, propFilter]);

    const debounceLoadData = useMemo(() => {
        const loadOptions = () => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);

            fetchOptions(
                {
                    ...filter,
                    ...(propFilter
                        ? {
                              ...propFilter,
                          }
                        : {}),
                },
                {
                    cancelToken: source.token,
                }
            ).then(({ data }) => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }

                setOptions(filter.page == 1 ? data : [...options, ...data]);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout, filter, propFilter]);
    return (
        <Select
            loading={fetching}
            filterOption={false}
            onScroll={onScroll}
            onSearch={(search) =>
                setFilter({
                    ...filter,
                    search,
                    page: 1,
                })
            }
            notFoundContent={
                fetching ? <Spin size="small" /> : "Không có giá trị"
            }
            {...props}
            options={options}
        />
    );
}; // Usage of DebounceSelect

export default DebounceSelect;
