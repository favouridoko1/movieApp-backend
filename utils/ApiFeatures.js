class ApiFeatures{
    constructor(query, queryStr) {
        this._query = query;
        this._queryStr = queryStr;
    }

    filter(){
        let queryString = JSON.stringify(this._queryStr)
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        const queryObj = JSON.parse(queryString);
  
}

module.exports = ApiFeatures;