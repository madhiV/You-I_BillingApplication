package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
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
 * Servlet implementation class EditItem
 */
public class EditItem extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public EditItem() {
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
		String itemName = request.getParameter("itemName");
		String itemCategory = request.getParameter("itemCategory");
		String itemCode = request.getParameter("itemCode");
		String itemAvailability = request.getParameter("itemAvailability");
		String oldItemName = request.getParameter("oldItemName");
		float itemPrice = Float.parseFloat(request.getParameter("itemPrice"));
		
		if(editItem(itemName, itemCategory, itemCode, itemAvailability, oldItemName, itemPrice)) {
			response.setStatus(response.SC_OK);
		}
		else {
			response.setStatus(response.SC_BAD_REQUEST);
		}
	}
	
	private boolean editItem(String itemName, String itemCategory, String itemCode, String itemAvailability, String oldItemName, float itemPrice) {
		try {
			int categoryId = getCategoryId(itemCategory);
			Statement st = DatabaseConnection.getConnection().createStatement();
			st.executeUpdate("update item set itemName = '"+itemName+"', itemCode = "+itemCode+", categoryId = "+categoryId+", availability = "+itemAvailability+", price = "+itemPrice+" where itemName = '"+oldItemName+"';");
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
