package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 * Servlet implementation class CategoryList
 */
public class CategoryList extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CategoryList() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String categoryPrefix = request.getParameter("categoryPrefix");
		categoryPrefix = categoryPrefix == null ? "" : categoryPrefix;
		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		try {
			Connection con= DriverManager.getConnection("jdbc:mysql://localhost:3306/YouAndI_BillingApp","madhizap","qwerty123"); 
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery("select categoryName from category where categoryName like '"+categoryPrefix+"%';");
			while(rs.next()) {
				String categoryName = rs.getString(1);
				out.println("<option value = '"+categoryName+"&#8291'>"+categoryName+"&#8291;</option>");
			}
			out.close();
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
		
		
	}

}
