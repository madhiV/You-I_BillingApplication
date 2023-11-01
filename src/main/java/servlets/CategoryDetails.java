package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import utility.DatabaseConnection;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 * Servlet implementation class CategoryDetails
 */
public class CategoryDetails extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CategoryDetails() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String categoryName = request.getParameter("categoryName");
		
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		try {
			Statement st = DatabaseConnection.getConnection().createStatement();
			ResultSet rs = st.executeQuery("select categoryCode, categoryName from category where categoryName ='"+categoryName+"';");
			rs.next();
			
			int categoryCode = rs.getInt(1);
			

			String jsonData = "{ \"categoryName\" : \""+categoryName+"\", \"categoryCode\" : "+ categoryCode+"}";
			
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

}
