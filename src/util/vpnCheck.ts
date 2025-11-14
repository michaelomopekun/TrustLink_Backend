
export const isVpnOrProxy = (req: any): boolean => {

    const forwarded = req.headers['x-forwarded-for'];

    const via = req.headers['via'];

    if (forwarded || via) return true;

    return false;
}