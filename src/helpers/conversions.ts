export const btcToSatoshi = (btc: number) => {
    return btc * 10000000;
}

/*
    T = type of array items;
    B = transformer parameter type;
    C = transformer return type;
*/

export function convertItemsToSatoshi<T>(items: T[], property: keyof T){
    const newItems = items.map((item) => {
        if(typeof item[property] === "number"){
            //@ts-ignore
            item[property] =  btcToSatoshi(item[property]);
        }
        return item;
    });
    return newItems;
}