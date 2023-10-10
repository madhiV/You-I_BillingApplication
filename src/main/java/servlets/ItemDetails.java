package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.sf.json.JSONObject;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 * Servlet implementation class ItemDetails
 */
public class ItemDetails extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ItemDetails() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String itemName = request.getParameter("itemName");
		
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		try {
			Connection con= DriverManager.getConnection("jdbc:mysql://localhost:3306/YouAndI_BillingApp","youandi_dev","developers_321"); 
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery("select categoryId, itemCode, availability from item where itemName ='"+itemName+"';");
			rs.next();
			
			int categoryId = rs.getInt(1);
			
			String categoryName = getCategoryName(categoryId);
			
			boolean itemAvailability = rs.getBoolean(3);
			int itemCode = rs.getInt(2);
			

			String jsonData = "{ \"itemName\" : \""+itemName+"\", \"categoryName\" : \""+ categoryName+"\", \"itemCode\" : "+itemCode+", \"itemAvailability\" : "+itemAvailability+"}";
			
			out.print(jsonData);
		}
		catch(Exception e){
			System.out.println(e);
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	
	private String getCategoryName(int categoryId) {
		try {
			Connection con= DriverManager.getConnection("jdbc:mysql://localhost:3306/YouAndI_BillingApp","youandi_dev","developers_321");
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery("select categoryName from category where categoryId ="+categoryId+";");
			rs.next();
			return rs.getString(1);
		}
		catch(Exception e){
			System.out.println(e);
		}
		throw new RuntimeException("Error while fetching category Name");
	}
}
