package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import utility.DatabaseConnection;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 * Servlet implementation class AddItem
 */
public class AddItem extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AddItem() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String itemName = request.getParameter("itemName");
		String itemCategory = request.getParameter("itemCategory");
		String itemCode = request.getParameter("itemCode");
		String itemAvailability = request.getParameter("itemAvailability");
		String itemPrice = request.getParameter("itemPrice");
		
		if(addItem(itemName, itemCategory, itemCode, itemAvailability, Float.parseFloat(itemPrice))) {
			response.setStatus(response.SC_OK);
		}
		else {
			response.setStatus(response.SC_BAD_REQUEST);
		}
	}

	private boolean addItem(String itemName, String itemCategory, String itemCode, String itemAvailability, float itemPrice) {
		try {
			int categoryId = getCategoryId(itemCategory);
			Statement st = DatabaseConnection.getConnection().createStatement();
			st.executeUpdate("insert into item values(null, "+categoryId+", '"+itemName+"', "+itemCode+", "+itemAvailability+", false, "+itemPrice+");");
			return true;
		}
		catch(Exception e){
			System.out.println(e);
			return false;
		}
	}
	
	private int getCategoryId(String categoryName) {
		try {
			Statement st = DatabaseConnection.getConnection().createStatement();
			ResultSet rs = st.executeQuery("select categoryId from category where categoryName='"+categoryName+"';");
			//TODO: 
			//If category name is not present condition
			rs.next();
			return Integer.parseInt(rs.getString(1));
		}
		catch(Exception e){
			System.out.println(e);
			//TODO: 
			//Need proper exception here...
			throw new RuntimeException();
		}
	}
}
