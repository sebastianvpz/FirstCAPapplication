using {com.seidortrial as seidor} from '../db/schema';

service CatalogService {
    entity Products as projection on seidor.Products;
    entity Suppliers as projection on seidor.Suppliers;
}
