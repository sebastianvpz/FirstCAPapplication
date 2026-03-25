using {com.seidortrial as seidor} from '../db/schema';

service CustomerService {
    entity Customer as projection on seidor.Customer;
}
