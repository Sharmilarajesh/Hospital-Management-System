import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
 
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Hospital Management System
            </h1>
            <p className="text-gray-600 mb-8">
              Please login or register to access the system
            </p>
            
            <div className="space-x-4 mb-8">
              <Link 
                to="/login" 
                className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark inline-block"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark inline-block"
              >
                Register
              </Link>
            </div>

            <div className="border border-gray-300 rounded-lg p-3 w-80 mx-auto">
              <h4>Login Details</h4>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Admin:</span> admin@hms.com / admin123
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Doctor:</span> Use credentials created by admin
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Patient:</span> Register new or use existing email
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;