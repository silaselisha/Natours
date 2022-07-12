class APIFeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    filter() {
        const queryObject = { ...this.queryString };
        const reservedFields = ['page', 'limit', 'fields', 'sort'];

        Object.keys(queryObject).forEach((item) => {
          if (reservedFields.includes(item)) {
            delete queryObject[item];
          }
        });

        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(
          /\b(gt|gte|lt|lte)\b/g,
          (match) => `$${match}`
        );
        
        this.query.find(JSON.parse(queryString))
        
        return this
    }

    fieldsSelect() {
        if (this.queryString.fields) {
          let fieldsString = this.queryString.fields;
          fieldsString = fieldsString.split(',').join(' ');

          this.query = this.query.select(fieldsString);
        } else {
          this.query = this.query.select('-__v');
        }

        return this
    }

    sorting() {
        if (this.queryString.sort) {
            let sortString = this.queryString.sort;
            sortString = sortString.split(',').join(' ');

            this.query = this.query.sort(sortString);
        }

        return this
    }

    pagination() {
        const page = +this.queryString.page || 1;
        const limit = +this.queryString.limit || 3;

        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this
    }
}


module.exports = APIFeatures