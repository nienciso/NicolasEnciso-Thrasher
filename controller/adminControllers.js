const renderAdmin = (req,res) =>{
    res.render("login");
};

const renderProduct = (req,res) =>{
    res.render("productos");
};

module.exports = {
    renderAdmin,
    renderProduct
};