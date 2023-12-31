package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import utility.DatabaseConnection;

import java.io.IOException;
import java.sql.Statement;

/**
 * Servlet implementation class AddItem
 */
public class AddCategory extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AddCategory() {
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
		String categoryName = request.getParameter("categoryName");
		String categoryCode = request.getParameter("categoryCode");
		if(addCategory(categoryName, categoryCode)) {
			response.setStatus(response.SC_OK);
		}
		else {
			response.setStatus(response.SC_BAD_REQUEST);
		}
	}
	
	private boolean addCategory(String categoryName, String categoryCode) {
		try {
			Statement st = DatabaseConnection.getConnection().createStatement();
			st.executeUpdate("insert into category values(null, '"+categoryName+"', '"+categoryCode+"');");
			return true;
		}
		catch(Exception e){
			return false;
		}
	}

}
