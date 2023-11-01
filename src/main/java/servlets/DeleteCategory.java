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
import java.sql.Statement;

/**
 * Servlet implementation class DeleteCategory
 */
public class DeleteCategory extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DeleteCategory() {
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
		String categoryName = request.getParameter("categoryName");
		
		if(deleteCategory(categoryName)) {
			response.setStatus(response.SC_OK);
		}
		else {
			response.setStatus(response.SC_BAD_REQUEST);
		}
	}

	private boolean deleteCategory(String categoryName) {
		//TODO: If some items are assigned to categoryName, we should set the items belonging to the current category
		//to unspecified category first before deletion...
		try {
			Statement st = DatabaseConnection.getConnection().createStatement();
			st.executeUpdate("delete from category where categoryName = '"+categoryName+"';");
			return true;
		}
		catch(Exception e){
			return false;
		}
	}
}
