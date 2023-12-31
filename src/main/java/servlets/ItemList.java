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
 * Servlet implementation class ItemList
 */
public class ItemList extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ItemList() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String itemPrefix = request.getParameter("itemPrefix");
		boolean appendItemCode = request.getParameter("appendItemCode") != null && request.getParameter("appendItemCode").equals("true");
		
		itemPrefix = itemPrefix == null ? "" : itemPrefix;
		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		try {
			Statement st = DatabaseConnection.getConnection().createStatement();
			ResultSet rs = st.executeQuery("select itemName, itemCode from item where itemName like '"+itemPrefix+"%';");
			while(rs.next()) {
				String itemName = rs.getString(1);
				out.println("<option value = '"+itemName+(appendItemCode ? "    "+rs.getString(2): "")+"&#8291'>");
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
		doGet(request, response);
	}

}
